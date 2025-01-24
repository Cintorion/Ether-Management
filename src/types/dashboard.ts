export interface MetricCard {
  title: string;
  value: string;
  change: {
    type: 'increase' | 'decrease';
    value: string;
    period: string;
  };
  color: string;
}

export interface Project {
  name: string;
  projectManager: string;
  dueDate: string;
  status: 'completed' | 'delayed' | 'in-progress';
  progress: number;
}