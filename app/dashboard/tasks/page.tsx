'use client';

import { TasksView } from '@/components/dashboard/tasks-view';

export default function TasksPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-zinc-500">Manage your tasks using the Kanban board below.</p>
      </div>
      <TasksView />
    </div>
  );
} 