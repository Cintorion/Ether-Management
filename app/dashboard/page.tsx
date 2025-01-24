'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/dashboard/project-card';
import { TaskList } from '@/components/dashboard/task-list';
import { Plus } from 'lucide-react';
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true })
      .limit(5);

    if (!error && data) {
      setTasks(data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => setShowCreateProject(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Tasks</h2>
        <TaskList tasks={tasks} />
      </div>

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        onProjectCreated={fetchProjects}
      />
    </div>
  );
} 