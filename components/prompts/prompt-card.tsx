'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Edit2, Trash2, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StorePromptButton } from "./store-prompt-button";

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    prompt_categories: {
      name: string;
      icon: string;
    };
    icon: string;
  };
  onPromptUpdated: () => void;
  showStoreButton?: boolean;
}

export function PromptCard({ prompt, onPromptUpdated, showStoreButton = true }: PromptCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: prompt.title,
    content: prompt.content,
  });
  const supabase = createClient();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast({
        title: 'Success',
        description: 'Prompt copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy prompt',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', prompt.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Prompt deleted successfully',
      });
      onPromptUpdated();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prompt',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('prompts')
        .update(formData)
        .eq('id', prompt.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Prompt updated successfully',
      });
      setShowEditDialog(false);
      onPromptUpdated();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update prompt',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            {prompt.icon && <span className="text-2xl">{prompt.icon}</span>}
            <h3 className="font-semibold text-lg">{prompt.title}</h3>
            <Badge variant="secondary" className="mt-2">
              {prompt.prompt_categories.name}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            {showStoreButton && (
              <StorePromptButton promptId={prompt.id} />
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 whitespace-pre-wrap">{prompt.content}</p>
        <div className="mt-4 flex gap-2">
          {prompt.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEditDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 