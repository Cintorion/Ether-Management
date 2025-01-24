'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
}

export default function CanvasPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Business Model Canvas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading projects...</div>
        ) : (
          projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}/canvas`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-sm text-gray-500 mt-2">Click to view or edit canvas</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 