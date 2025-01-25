'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  tasksByDay: {
    date: string;
    completed: number;
    total: number;
  }[];
}

interface TaskStatsProps {
  tasks: any[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats: TaskStats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    todoTasks: tasks.filter(t => t.status === 'todo').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    tasksByDay: getTasksByDay(tasks)
  };

  const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0;

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-zinc-500">Total Tasks</h3>
          <p className="text-2xl font-bold">{stats.totalTasks}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-zinc-500">Completion Rate</h3>
          <p className="text-2xl font-bold">{completionRate}%</p>
          <Progress value={completionRate} className="mt-2" />
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-zinc-500">In Progress</h3>
          <p className="text-2xl font-bold">{stats.inProgressTasks}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-zinc-500">Todo</h3>
          <p className="text-2xl font-bold">{stats.todoTasks}</p>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-zinc-500 mb-4">Task Completion Trend</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.tasksByDay}>
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Bar
                dataKey="completed"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                name="Completed Tasks"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function getTasksByDay(tasks: any[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  return last7Days.map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    completed: tasks.filter(t => 
      t.status === 'done' && 
      new Date(t.updated_at).toISOString().split('T')[0] === date
    ).length,
    total: tasks.filter(t => 
      new Date(t.created_at).toISOString().split('T')[0] === date
    ).length,
  }));
} 