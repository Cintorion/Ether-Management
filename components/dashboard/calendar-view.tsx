'use client';

import { useState } from 'react';
import { addDays, format, startOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { Task } from '@/types/task';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, ListTodo, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6)
  });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => task.due_date && isSameDay(new Date(task.due_date), date));
  };

  const getTaskStyle = (task: Task) => {
    switch(task.priority) {
      case 'high':
        return 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 text-yellow-500';
      default:
        return 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-500';
    }
  };

  // Update the TaskCard component styling
  function TaskCard({ task, number }: { task: Task; number: number }) {
    return (
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1a2234] hover:bg-[#1e2738] transition-colors group">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#2a3441] text-gray-300 text-sm font-medium">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-200 truncate">{task.title}</h4>
          <p className="text-sm text-gray-400 truncate">{task.description}</p>
          {task.due_date && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-[#2a3441]" />
                <div className="w-6 h-6 rounded-full bg-[#2a3441]" />
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(task.due_date), 'MMM d, h:mm a')}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {task.priority === 'high' && (
            <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-300">
              Urgent
            </span>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-200">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[#151b2b] border-[#1e2738] rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {format(weekStart, 'MMMM yyyy')}
            </h2>
            <p className="text-zinc-400 text-sm">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekStart(date => addDays(date, -7))}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekStart(date => addDays(date, 7))}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-[1px] bg-[#1e2738] rounded-lg overflow-hidden">
          {weekDays.map((date, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-[#1a2234] min-h-[200px] transition-colors",
                isToday(date) && "bg-[#202942]"
              )}
            >
              <div className={cn(
                "p-2 border-b border-[#1e2738] text-center",
                isToday(date) && "bg-blue-500/10"
              )}>
                <div className="text-sm font-medium text-gray-300">{format(date, 'EEE')}</div>
                <div className={cn(
                  "inline-flex items-center justify-center w-8 h-8 mt-1 rounded-full text-sm",
                  isToday(date) ? "bg-blue-500 text-white font-semibold" : "text-gray-400"
                )}>
                  {format(date, 'd')}
                </div>
              </div>
              <div className="p-2 space-y-2">
                {getTasksForDate(date).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "px-3 py-2 rounded-md border text-xs transition-colors cursor-pointer",
                      task.priority === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-300' :
                      task.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/10 border-blue-500/20 text-blue-300'
                    )}
                  >
                    <div className="font-medium truncate">{task.title}</div>
                    {task.due_date && (
                      <div className="text-xs mt-1 opacity-80 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {format(new Date(task.due_date), 'h:mm a')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-200">Active Tasks</h3>
              </div>
              <Button variant="outline" size="sm" className="border-[#2a3441] hover:bg-[#1e2738]">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {tasks
                .filter(task => task.status !== 'done')
                .slice(0, 5)
                .map((task, index) => (
                  <TaskCard key={task.id} task={task} number={index + 1} />
                ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">Urgent Tasks</h3>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {tasks
                .filter(task => task.priority === 'high' && task.status !== 'done')
                .slice(0, 3)
                .map((task, index) => (
                  <TaskCard key={task.id} task={task} number={index + 1} />
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">In Progress</h3>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === 'in-progress')
                .slice(0, 3)
                .map((task, index) => (
                  <TaskCard key={task.id} task={task} number={index + 1} />
                ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-white">Completed</h3>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === 'done')
                .slice(0, 3)
                .map((task, index) => (
                  <TaskCard key={task.id} task={task} number={index + 1} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 