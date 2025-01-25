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

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-zinc-950">
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

        <div className="grid grid-cols-7 gap-[1px] bg-zinc-800 rounded-lg overflow-hidden">
          {weekDays.map((date, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-zinc-900 min-h-[200px] transition-colors",
                isToday(date) && "bg-zinc-800"
              )}
            >
              <div className={cn(
                "p-2 border-b border-zinc-800 text-center",
                isToday(date) && "bg-blue-500/10"
              )}>
                <div className="text-sm font-medium text-zinc-300">{format(date, 'EEE')}</div>
                <div className={cn(
                  "inline-flex items-center justify-center w-8 h-8 mt-1 rounded-full text-sm",
                  isToday(date) && "bg-blue-500 text-white font-semibold"
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
                      getTaskStyle(task)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-zinc-950">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-white">Upcoming Tasks</h3>
          </div>
          <div className="space-y-2">
            {tasks
              .filter(task => task.due_date && new Date(task.due_date) > new Date())
              .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
              .slice(0, 4)
              .map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900">
                  <div>
                    <p className="font-medium text-sm text-zinc-200">{task.title}</p>
                    <p className="text-xs text-zinc-400">
                      {format(new Date(task.due_date!), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-blue-500/10 text-blue-500'
                  )}>
                    {task.priority}
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-4 bg-zinc-950">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-white">Urgent Tasks</h3>
          </div>
          <div className="space-y-2">
            {tasks
              .filter(task => task.priority === 'high' && task.status !== 'done')
              .slice(0, 4)
              .map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900">
                  <div>
                    <p className="font-medium text-sm text-zinc-200">{task.title}</p>
                    <p className="text-xs text-zinc-400">{task.description}</p>
                  </div>
                  {task.due_date && (
                    <div className="text-xs text-red-500">
                      {format(new Date(task.due_date), 'MMM d')}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-4 bg-zinc-950">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-white">In Progress</h3>
          </div>
          <div className="space-y-2">
            {tasks
              .filter(task => task.status === 'in-progress')
              .slice(0, 4)
              .map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900">
                  <div>
                    <p className="font-medium text-sm text-zinc-200">{task.title}</p>
                    <p className="text-xs text-zinc-400">{task.description}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-4 bg-zinc-950">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-white">Recently Completed</h3>
          </div>
          <div className="space-y-2">
            {tasks
              .filter(task => task.status === 'done')
              .slice(0, 4)
              .map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900">
                  <div>
                    <p className="font-medium text-sm text-zinc-200">{task.title}</p>
                    <p className="text-xs text-zinc-400">{task.description}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 