'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PromptCategory, Prompt } from '@/types/prompt';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Folder, Save, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function PromptStorage() {
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
    fetchPrompts();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('prompt_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
      return;
    }

    setCategories(data);
  };

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch prompts',
        variant: 'destructive',
      });
      return;
    }

    setPrompts(data);
  };

  const savePrompt = async (prompt: Partial<Prompt>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('prompts')
      .insert([
        {
          ...prompt,
          user_id: user.id,
        }
      ]);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save prompt',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Prompt saved successfully',
    });
    fetchPrompts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Prompt Storage</h2>
        <Button onClick={() => {/* Open create category dialog */}}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-4 bg-[#151b2b] border-[#1e2738]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-[#1a2234]">
                {/* You can use different icons based on category.icon */}
                <Folder className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">{category.name}</h3>
                <p className="text-sm text-zinc-400">{category.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              {prompts
                .filter(p => p.category_id === category.id)
                .map(prompt => (
                  <div key={prompt.id} className="flex items-center justify-between p-2 rounded-lg bg-[#1a2234]">
                    <span className="text-sm text-zinc-200">{prompt.name}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => {/* Copy prompt */}}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => savePrompt(prompt)}>
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 