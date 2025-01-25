'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { toast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);

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

    fetchTasks();
  }, []);

  if (loading) {
    return <div className="p-6 text-zinc-400">Loading calendar...</div>;
  }

  return (
    <div className="flex-1 bg-[#0f1117]">
      <div className="h-full overflow-auto">
        <div className="max-w-[1800px] mx-auto">
          <div className="p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Calendar</h1>
              <p className="text-zinc-400">View your tasks by date</p>
            </div>
            <CalendarView tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
} 