'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { Link2, Settings, Diamond, Heart, Users, BarChart2, Truck, DollarSign, CreditCard, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CanvasData {
  key_partners: string;
  key_activities: string;
  key_resources: string;
  value_propositions: string;
  customer_relationships: string;
  channels: string;
  customer_segments: string;
  cost_structure: string;
  revenue_streams: string;
}

interface BusinessModelCanvasProps {
  projectId: string;
}

interface GridCell {
  key: keyof CanvasData;
  title: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
}

export function BusinessModelCanvas({ projectId }: BusinessModelCanvasProps) {
  const [canvasId, setCanvasId] = useState<string | null>(null);
  const [cells, setCells] = useState<CanvasData>({
    key_partners: '',
    key_activities: '',
    key_resources: '',
    value_propositions: '',
    customer_relationships: '',
    channels: '',
    customer_segments: '',
    cost_structure: '',
    revenue_streams: '',
  });
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);

  const saveCanvas = async (newCells: CanvasData) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (canvasId) {
        console.log('Updating canvas:', canvasId, newCells);
        const { error } = await supabase
          .from('canvases')
          .update({ 
            cells: newCells,
            updated_at: new Date().toISOString()
          })
          .eq('id', canvasId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        console.log('Creating new canvas:', newCells);
        const { data, error } = await supabase
          .from('canvases')
          .insert({
            project_id: projectId,
            user_id: user.id,
            title: 'Business Model Canvas',
            cells: newCells,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setCanvasId(data.id);
      }

      toast({
        title: 'Success',
        description: 'Canvas saved successfully',
      });
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCellChange = (key: keyof CanvasData, value: string) => {
    const newCells = { ...cells, [key]: value };
    setCells(newCells);
  };

  const handleSave = () => {
    saveCanvas(cells);
  };

  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
          .from('canvases')
          .select('*')
          .eq('project_id', projectId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return; // No data found
          throw error;
        }

        if (data) {
          console.log('Fetched canvas:', data);
          setCanvasId(data.id);
          setCells(data.cells as CanvasData);
        }
      } catch (error) {
        console.error('Error fetching canvas:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch canvas data',
          variant: 'destructive',
        });
      }
    };

    fetchCanvas();
  }, [projectId]);

  const gridCells: GridCell[] = [
    {
      key: 'key_partners',
      title: 'Key Partners',
      icon: Link2,
      color: 'bg-[#D2B48C]',
      textColor: 'text-white',
    },
    {
      key: 'key_activities',
      title: 'Key Activities',
      icon: Settings,
      color: 'bg-[#E9967A]',
      textColor: 'text-white',
    },
    {
      key: 'value_propositions',
      title: 'Value Proposition',
      icon: Diamond,
      color: 'bg-[#2F4F4F]',
      textColor: 'text-white',
    },
    {
      key: 'customer_relationships',
      title: 'Customer Relationships',
      icon: Heart,
      color: 'bg-[#3CB371]',
      textColor: 'text-white',
    },
    {
      key: 'customer_segments',
      title: 'Customer Segments',
      icon: Users,
      color: 'bg-[#5F9EA0]',
      textColor: 'text-white',
    },
    {
      key: 'key_resources',
      title: 'Key Resources',
      icon: BarChart2,
      color: 'bg-[#FFB6C1]',
      textColor: 'text-black',
    },
    {
      key: 'channels',
      title: 'Channels',
      icon: Truck,
      color: 'bg-[#DAA520]',
      textColor: 'text-white',
    },
    {
      key: 'cost_structure',
      title: 'Cost Structure',
      icon: DollarSign,
      color: 'bg-[#FF7F50]',
      textColor: 'text-white',
    },
    {
      key: 'revenue_streams',
      title: 'Revenue Streams',
      icon: CreditCard,
      color: 'bg-[#8B4513]',
      textColor: 'text-white',
    },
  ];

  const renderIcon = (Icon: React.ElementType) => {
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="p-4">
      <div className="mb-4 bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Designed For:</p>
            <input
              type="text"
              className="border-b bg-transparent focus:outline-none"
              placeholder="Enter name..."
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Version 1</p>
            </div>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="ml-4"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Canvas'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 h-[calc(100vh-200px)]">
        <div className="col-span-1 row-span-2">
          <div className={`h-full rounded-lg ${gridCells[0].color} p-4`}>
            <div className={`flex items-center gap-2 ${gridCells[0].textColor} mb-3`}>
              {renderIcon(gridCells[0].icon)}
              <h3 className="font-semibold">{gridCells[0].title}</h3>
            </div>
            <textarea
              value={cells.key_partners}
              onChange={(e) => handleCellChange('key_partners', e.target.value)}
              className="w-full h-[calc(100%-2rem)] bg-white/10 rounded p-2 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Who are your key partners and suppliers?"
            />
          </div>
        </div>

        {/* Middle sections */}
        <div className="col-span-2 grid grid-rows-2 gap-3">
          {/* Top row */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((index) => (
              <div key={gridCells[index].key} className={`rounded-lg ${gridCells[index].color} p-4`}>
                <div className={`flex items-center gap-2 ${gridCells[index].textColor} mb-3`}>
                  {renderIcon(gridCells[index].icon)}
                  <h3 className="font-semibold">{gridCells[index].title}</h3>
                </div>
                <textarea
                  value={cells[gridCells[index].key]}
                  onChange={(e) => handleCellChange(gridCells[index].key, e.target.value)}
                  className="w-full h-[calc(100%-2rem)] bg-white/10 rounded p-2 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder={`Enter ${gridCells[index].title}...`}
                />
              </div>
            ))}
          </div>
          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-3">
            {[5, 6].map((index) => (
              <div key={gridCells[index].key} className={`rounded-lg ${gridCells[index].color} p-4`}>
                <div className={`flex items-center gap-2 ${gridCells[index].textColor} mb-3`}>
                  {renderIcon(gridCells[index].icon)}
                  <h3 className="font-semibold">{gridCells[index].title}</h3>
                </div>
                <textarea
                  value={cells[gridCells[index].key]}
                  onChange={(e) => handleCellChange(gridCells[index].key, e.target.value)}
                  className="w-full h-[calc(100%-2rem)] bg-white/10 rounded p-2 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder={`Enter ${gridCells[index].title}...`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="col-span-1 row-span-2">
          <div className={`h-full rounded-lg ${gridCells[2].color} p-4`}>
            <div className={`flex items-center gap-2 ${gridCells[2].textColor} mb-3`}>
              {renderIcon(gridCells[2].icon)}
              <h3 className="font-semibold">{gridCells[2].title}</h3>
            </div>
            <textarea
              value={cells.value_propositions}
              onChange={(e) => handleCellChange('value_propositions', e.target.value)}
              className="w-full h-[calc(100%-2rem)] bg-white/10 rounded p-2 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="What value do you deliver to the customer?"
            />
          </div>
        </div>

        {/* Customer side */}
        <div className="col-span-1 row-span-2">
          <div className={`h-full rounded-lg ${gridCells[4].color} p-4`}>
            <div className={`flex items-center gap-2 ${gridCells[4].textColor} mb-3`}>
              {renderIcon(gridCells[4].icon)}
              <h3 className="font-semibold">{gridCells[4].title}</h3>
            </div>
            <textarea
              value={cells.customer_segments}
              onChange={(e) => handleCellChange('customer_segments', e.target.value)}
              className="w-full h-[calc(100%-2rem)] bg-white/10 rounded p-2 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Who are your most important customers?"
            />
          </div>
        </div>

        {/* Bottom row spanning full width */}
        <div className="col-span-5 grid grid-cols-2 gap-3">
          {[7, 8].map((index) => (
            <div key={gridCells[index].key} className={`rounded-lg ${gridCells[index].color} p-4`}>
              <div className={`flex items-center gap-2 ${gridCells[index].textColor} mb-3`}>
                {renderIcon(gridCells[index].icon)}
                <h3 className="font-semibold">{gridCells[index].title}</h3>
              </div>
              <textarea
                value={cells[gridCells[index].key]}
                onChange={(e) => handleCellChange(gridCells[index].key, e.target.value)}
                className="w-full h-24 bg-white/10 rounded p-2 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder={`Enter ${gridCells[index].title}...`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 