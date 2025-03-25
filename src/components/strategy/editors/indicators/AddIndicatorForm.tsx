
import React from 'react';
import { indicatorConfig } from '../../utils/indicatorConfig';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddIndicatorFormProps {
  selectedIndicator: string;
  onSelectIndicator: (indicator: string) => void;
  onAddIndicator: () => void;
}

const AddIndicatorForm: React.FC<AddIndicatorFormProps> = ({
  selectedIndicator,
  onSelectIndicator,
  onAddIndicator
}) => {
  const allIndicatorOptions = Object.keys(indicatorConfig);
  
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedIndicator) {
      onAddIndicator();
    }
  };
  
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Label htmlFor="indicator-select" className="mb-2 block">
          Add Indicator
        </Label>
        <Select
          value={selectedIndicator}
          onValueChange={onSelectIndicator}
        >
          <SelectTrigger id="indicator-select">
            <SelectValue placeholder="Select indicator" />
          </SelectTrigger>
          <SelectContent>
            {allIndicatorOptions.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        size="sm" 
        onClick={handleAdd} 
        disabled={!selectedIndicator}
        className="mb-0.5"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
    </div>
  );
};

export default AddIndicatorForm;
