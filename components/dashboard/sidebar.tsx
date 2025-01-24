'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Home, LayoutDashboard, ClipboardList, Target, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <div className="w-64 bg-white border-r h-screen p-4">
      <div className="flex items-center space-x-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary" />
        <span className="text-xl font-bold">ProjectHub</span>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <Home className="h-5 w-5" />
          <span>Overview</span>
        </Link>

        <Link
          href="/dashboard/projects"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Projects</span>
        </Link>

        <Link
          href="/dashboard/tasks"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <ClipboardList className="h-5 w-5" />
          <span>Tasks</span>
        </Link>

        <Link
          href="/dashboard/mvp"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <Target className="h-5 w-5" />
          <span>MVP Tracking</span>
        </Link>
      </nav>

      <button
        onClick={handleSignOut}
        className="absolute bottom-4 flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-red-500"
      >
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
} 