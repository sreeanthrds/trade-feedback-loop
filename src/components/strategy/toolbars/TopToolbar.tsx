
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, Upload } from 'lucide-react';

interface TopToolbarProps {
  onReset: () => void;
  onImportSuccess: () => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ onReset, onImportSuccess }) => {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
