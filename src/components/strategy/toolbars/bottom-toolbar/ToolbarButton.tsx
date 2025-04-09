
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  disabled = false,
  variant = 'secondary'
}) => {
  return (
    <Button 
      variant={variant} 
      onClick={onClick} 
      disabled={disabled}
    >
      <Icon className="mr-1 h-4 w-4" />
      {label}
    </Button>
  );
};

export default ToolbarButton;
