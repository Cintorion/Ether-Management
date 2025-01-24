'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { createClient } from '@/lib/supabase/client';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CreateTaskDialog } from './create-task-dialog';
import type { DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  project_id: string;
  order_index: number;
}

const columns = {
  todo: {
    title: 'To Do',
    className: 'bg-gray-50',
  },
  'in-progress': {
    title: 'In Progress',
    className: 'bg-blue-50',
  },
  completed: {
    title: 'Completed',
    className: 'bg-green-50',
  },
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const supabase = createClient();

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const projectId = searchParams.get('projectId');
      setCurrentProject(projectId);

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error:', error);
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
  }, [searchParams]); // Re-fetch when URL params change

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, removed);

    // Update order_index and status
    const updatedTask = {
      ...removed,
      status: destination.droppableId,
      order_index: destination.index,
    };

    setTasks(newTasks);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: destination.droppableId,
          order_index: destination.index,
        })
        .eq('id', updatedTask.id);

      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setShowCreateTask(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="space-y-2">
                <h3 className="font-semibold">{column.title}</h3>
                <Droppable droppableId={columnId}>
                  {(provided: DroppableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[500px] p-4 rounded-lg ${column.className}`}
                    >
                      {tasks
                        .filter((task) => task.status === columnId)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-4 mb-2 rounded-lg shadow"
                              >
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-500">{task.description}</p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        onTaskCreated={fetchTasks}
        initialProjectId={currentProject}
      />
    </div>
  );
} 