'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category_id: string;
  tags: string[];
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchData = async () => {
    try {
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch prompts with category information
      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select(`
          *,
          prompt_categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (promptsError) {
        console.error('Prompts error:', promptsError);
        throw promptsError;
      }

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('prompt_categories')
        .select('*');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw categoriesError;
      }

      console.log('Fetched prompts:', promptsData);
      console.log('Fetched categories:', categoriesData);

      setPrompts(promptsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = searchQuery.length === 0 || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || prompt.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCopy = async (text: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(promptId);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Sidebar - Categories */}
      <div className="w-64 border-r border-zinc-800 p-6">
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "w-full text-left px-4 py-2 rounded-lg text-zinc-400 hover:bg-zinc-900/50",
              !selectedCategory && "bg-zinc-900 text-white"
            )}
          >
            <span>All Prompts</span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "w-full text-left px-4 py-2 rounded-lg text-zinc-400 hover:bg-zinc-900/50",
                selectedCategory === category.id && "bg-zinc-900 text-white"
              )}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input
                className="w-full pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 h-12 rounded-lg"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <Card 
                key={prompt.id} 
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors h-full flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                    <button
                      onClick={() => handleCopy(prompt.content, prompt.id)}
                      className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
                    >
                      {copiedId === prompt.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-zinc-300 mb-4 flex-1 whitespace-pre-wrap">{prompt.content}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {prompt.tags?.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 