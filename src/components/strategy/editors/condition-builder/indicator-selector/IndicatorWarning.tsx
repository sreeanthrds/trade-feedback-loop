
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface IndicatorWarningProps {
  indicatorName: string;
  displayName: string;
  isMissing: boolean;
}

const IndicatorWarning: React.FC<IndicatorWarningProps> = ({
  indicatorName,
  displayName,
  isMissing
}) => {
  if (!isMissing || !indicatorName) {
    return null;
  }

  return (
    <Alert variant="destructive" className="py-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-xs">
        Indicator <strong>{displayName}</strong> is no longer 
        available in the Start Node. Please select a different indicator.
      </AlertDescription>
    </Alert>
  );
};

export default IndicatorWarning;
