'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{project.name}</span>
          <Badge>{project.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </CardContent>
    </Card>
  );
} 