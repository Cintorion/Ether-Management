"use client";

import { cn } from "@/lib/utils";

interface Project {
  name: string;
  projectManager: string;
  dueDate: string;
  status: 'completed' | 'delayed' | 'in-progress';
  progress: number;
}

const statusStyles = {
  completed: "bg-green-100 text-green-800",
  delayed: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
};

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Project summary</h2>
          <div className="flex gap-2">
            <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <option>All Projects</option>
            </select>
            <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <option>All Managers</option>
            </select>
            <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <option>All Status</option>
            </select>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Project manager</th>
              <th className="pb-3 font-medium">Due date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="py-4">{project.name}</td>
                <td className="py-4">{project.projectManager}</td>
                <td className="py-4">{project.dueDate}</td>
                <td className="py-4">
                  <span className={cn("px-2 py-1 rounded-full text-sm", statusStyles[project.status])}>
                    {project.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{project.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}