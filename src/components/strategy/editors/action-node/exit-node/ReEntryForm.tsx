
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import SwitchField from '../../shared/SwitchField';

interface ReEntryFormProps {
  reEntryEnabled: boolean;
  onReEntryToggle: (checked: boolean) => void;
}

const ReEntryForm: React.FC<ReEntryFormProps> = ({
  reEntryEnabled,
  onReEntryToggle
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <RefreshCcw size={16} className={reEntryEnabled ? "text-primary" : "text-muted-foreground"} />
        <h3 className="text-sm font-medium">Re-Entry Settings</h3>
      </div>
      
      <SwitchField
        label="Enable Re-Entry"
        checked={reEntryEnabled}
        onCheckedChange={onReEntryToggle}
        description="Create a retry node to re-enter the market after exit"
      />
      
      {reEntryEnabled && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="text-muted-foreground">
            A Retry Node has been created and linked to this Exit Node. Configure the retry settings in the Retry Node's panel.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReEntryForm;
