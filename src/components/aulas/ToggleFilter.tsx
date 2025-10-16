'use client';

import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ToggleFilterProps {
  active: boolean;
  count: number;
  onChange: (active: boolean) => void;
}

export function ToggleFilter({ active, count, onChange }: ToggleFilterProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={() => onChange(!active)}
      className="relative transition-all duration-200 h-9 gap-1.5"
    >
      <Star 
        className={`h-3.5 w-3.5 transition-all duration-200 ${
          active ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
        }`} 
      />
      <span className="hidden sm:inline text-sm">Favoritas</span>
      {count > 0 && (
        <Badge 
          variant="secondary" 
          className="ml-0.5 px-1.5 py-0 h-4 text-xs bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-800"
        >
          {count}
        </Badge>
      )}
    </Button>
  );
}
