'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { createClient } from '@/lib/supabase/client';
import { Plus, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CreateTaskDialog } from './create-task-dialog';
import type { DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  project_id: string;
  order_index: number;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  labels: string[];
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, status: string) => void;
}

const columns = {
  todo: {
    title: 'To Do',
    items: [] as Task[],
  },
  'in-progress': {
    title: 'In Progress',
    items: [] as Task[],
  },
  done: {
    title: 'Done',
    items: [] as Task[],
  },
};

const isValidStatus = (status: string): status is keyof typeof columns => {
  const validStatuses = ['todo', 'in-progress', 'done'];
  return validStatuses.includes(status);
};

export function KanbanBoard({ tasks, onTaskUpdate }: KanbanBoardProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Initialize columns with empty arrays
  const organizedTasks = {
    todo: { title: 'To Do', items: [] as Task[] },
    'in-progress': { title: 'In Progress', items: [] as Task[] },
    done: { title: 'Done', items: [] as Task[] }
  };

  // Sort tasks into columns
  tasks.forEach(task => {
    if (isValidStatus(task.status)) {
      organizedTasks[task.status].items.push(task);
    }
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Don't do anything if dropped in the same place
    if (source.droppableId === destination.droppableId) return;

    // Get the task that was dragged
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Update the task status
    const newStatus = destination.droppableId;
    if (isValidStatus(newStatus)) {
      onTaskUpdate(draggableId, newStatus);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-zinc-500">Manage your tasks using the Kanban board below.</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(organizedTasks).map(([columnId, column]) => (
            <div key={columnId} className="bg-zinc-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <span className="text-sm text-zinc-400">{column.items.length} tasks</span>
              </div>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {column.items.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{task.title}</h4>
                                <p className="text-sm text-zinc-400 mt-1">{task.description}</p>
                                {task.due_date && (
                                  <div className="flex items-center mt-2 text-sm text-zinc-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(task.due_date).toLocaleDateString()}
                                  </div>
                                )}
                                {task.labels?.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {task.labels.map(label => (
                                      <span
                                        key={label}
                                        className="px-2 py-0.5 text-xs rounded-full bg-zinc-700 text-zinc-300"
                                      >
                                        {label}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 border-zinc-700">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  <DropdownMenuItem
                                    onClick={() => onTaskUpdate(task.id, 'todo')}
                                    disabled={task.status === 'todo'}
                                  >
                                    Move to Todo
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onTaskUpdate(task.id, 'in-progress')}
                                    disabled={task.status === 'in-progress'}
                                  >
                                    Move to In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onTaskUpdate(task.id, 'done')}
                                    disabled={task.status === 'done'}
                                  >
                                    Move to Done
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </Card>
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

      <CreateTaskDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onTaskCreated={() => onTaskUpdate('', '')}
      />
    </div>
  );
} 