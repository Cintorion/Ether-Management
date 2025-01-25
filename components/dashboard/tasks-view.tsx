'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { KanbanBoard } from '@/components/dashboard/kanban-board';
import { toast } from '@/hooks/use-toast';
import { TaskStats } from '@/components/dashboard/task-stats';
import { Task } from '@/types/task';

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskUpdate = async (taskId: string, newStatus: string) => {
    try {
      if (taskId && newStatus) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('tasks')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', taskId)
          .eq('user_id', user.id);

        if (error) throw error;
      }
      
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <TaskStats tasks={tasks} />
      <KanbanBoard tasks={tasks} onTaskUpdate={handleTaskUpdate} />
    </div>
  );
} 