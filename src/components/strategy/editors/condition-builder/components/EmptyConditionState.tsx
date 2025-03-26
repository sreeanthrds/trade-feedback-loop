
import React from 'react';

interface EmptyConditionStateProps {
  addCondition: () => void;
}

const EmptyConditionState: React.FC<EmptyConditionStateProps> = ({ addCondition }) => {
  return (
    <div className="text-sm text-muted-foreground py-4 text-center border border-dashed border-muted-foreground/50 rounded-md">
      <p className="mb-2">No conditions defined</p>
      <button
        className="text-primary text-sm hover:underline"
        onClick={addCondition}
      >
        Add your first condition
      </button>
    </div>
  );
};

export default EmptyConditionState;
