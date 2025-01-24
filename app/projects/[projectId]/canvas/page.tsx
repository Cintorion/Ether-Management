'use client';

import { BusinessModelCanvas } from '@/components/canvas/business-model-canvas';

export default function CanvasPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Business Model Canvas</h1>
      <BusinessModelCanvas projectId={params.projectId} />
    </div>
  );
} 