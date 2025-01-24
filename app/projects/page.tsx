"use client";

import { useState } from "react";

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

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <button className="bg-black text-white px-4 py-2 rounded-lg font-medium">
              New Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    project.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Manager: {project.projectManager}
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Due: {project.dueDate}</span>
                <button className="text-blue-600 hover:text-blue-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}