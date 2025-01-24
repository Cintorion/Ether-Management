"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { ProjectTable } from "@/components/dashboard/project-table";

const metrics = [
  {
    title: "Total revenue",
    value: "$53,009.89",
    change: {
      type: "increase" as const,
      value: "12% increase",
      period: "last month"
    },
    color: "bg-purple-100"
  },
  {
    title: "Projects",
    value: "95/100",
    change: {
      type: "decrease" as const,
      value: "10% decrease",
      period: "last month"
    },
    color: "bg-orange-100"
  },
  {
    title: "Time spent",
    value: "1022/1300 Hrs",
    change: {
      type: "increase" as const,
      value: "8% increase",
      period: "last month"
    },
    color: "bg-blue-100"
  },
  {
    title: "Resources",
    value: "101/120",
    change: {
      type: "increase" as const,
      value: "2% increase",
      period: "last month"
    },
    color: "bg-yellow-100"
  }
];

const projects = [
  {
    name: "Nelsa web development",
    projectManager: "Om prakash sao",
    dueDate: "May 25, 2023",
    status: "completed" as const,
    progress: 100
  },
  {
    name: "Datascale AI app",
    projectManager: "Neilsan mando",
    dueDate: "Jun 20, 2023",
    status: "delayed" as const,
    progress: 28
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for anything..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-[300px]"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <ProjectTable projects={projects} />
      </div>
    </div>
  );
}