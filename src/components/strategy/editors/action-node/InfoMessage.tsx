
import React from 'react';

interface InfoMessageProps {
  actionType?: 'entry' | 'exit' | 'alert';
}

const InfoMessage: React.FC<InfoMessageProps> = ({ actionType }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mt-3">
      <p className="text-sm text-foreground/70">
        {actionType === 'entry' 
          ? "Entry orders open new positions based on the configured settings."
          : actionType === 'exit'
          ? "Exit orders close existing positions from previous entry nodes."
          : "Alerts notify you when conditions are met without executing trades."}
      </p>
    </div>
  );
};

export default InfoMessage;
