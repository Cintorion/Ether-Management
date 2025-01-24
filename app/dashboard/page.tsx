'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Activity, Users, CheckCircle } from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch projects stats
      const { data: projects } = await supabase
        .from('projects')
        .select('status')
        .eq('user_id', user.id);

      // Fetch tasks stats
      const { data: tasks } = await supabase
        .from('tasks')
        .select('status')
        .eq('user_id', user.id);

      setStats({
        totalProjects: projects?.length || 0,
        completedProjects: projects?.filter(p => p.status === 'completed').length || 0,
        totalTasks: tasks?.length || 0,
        completedTasks: tasks?.filter(t => t.status === 'completed').length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats_cards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: BarChart,
      color: 'text-blue-500',
    },
    {
      title: 'Project Completion',
      value: `${Math.round((stats.completedProjects / stats.totalProjects) * 100) || 0}%`,
      icon: Activity,
      color: 'text-green-500',
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckCircle,
      color: 'text-purple-500',
    },
    {
      title: 'Task Completion',
      value: `${Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%`,
      icon: Users,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats_cards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            {stat.title.includes('Completion') && (
              <Progress 
                value={parseInt(stat.value)} 
                className="mt-4"
              />
            )}
          </Card>
        ))}
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
} 