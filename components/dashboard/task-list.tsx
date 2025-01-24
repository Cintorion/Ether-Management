'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <Checkbox id={task.id} />
              <label htmlFor={task.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {task.title}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 