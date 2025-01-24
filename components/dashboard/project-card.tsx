'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Edit2, Trash2, ListTodo } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  onProjectUpdated: () => void;
}

export function ProjectCard({ project, onProjectUpdated }: ProjectCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    status: project.status,
  });

  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      onProjectUpdated();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      console.log('Updating project:', {
        id: project.id,
        formData,
        user_id: user.id
      });

      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          description: formData.description,
          status: formData.status.toLowerCase(),
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      setShowEditDialog(false);
      onProjectUpdated();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project',
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
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <div className="flex gap-2">
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
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{project.description}</p>
        <div className="flex justify-between items-center">
          <span className={`text-sm px-2 py-1 rounded-full ${
            project.status === 'completed' ? 'bg-green-100 text-green-800' :
            project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
          <Link href={`/dashboard/tasks?projectId=${project.id}`}>
            <Button variant="outline" size="sm">
              <ListTodo className="h-4 w-4 mr-2" />
              View Tasks
            </Button>
          </Link>
        </div>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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