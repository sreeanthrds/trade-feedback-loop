
import React from 'react';
import { InfoBox } from '../shared';
import { AlertTriangle } from 'lucide-react';

const AlertMessage: React.FC = () => {
  return (
    <InfoBox type="warning">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
        <span className="font-medium">Alert Only Mode</span>
      </div>
      <p>
        In Alert mode, the strategy will generate notifications but won't execute any trades. 
        Use this for testing or when you want to be notified of signals before manually executing trades.
      </p>
    </InfoBox>
  );
};

export default AlertMessage;
