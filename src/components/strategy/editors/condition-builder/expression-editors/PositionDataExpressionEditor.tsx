
import React from 'react';
import { Expression } from '../../../utils/conditions';
import { usePositionData } from './position-data/usePositionData';
import PositionFieldSelector from './position-data/PositionFieldSelector';
import FilterTypeSwitch from './position-data/FilterTypeSwitch';
import PositionIdSelector from './position-data/PositionIdSelector';
import PositionTagSelector from './position-data/PositionTagSelector';

interface PositionDataExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const PositionDataExpressionEditor: React.FC<PositionDataExpressionEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'position_data') {
    return null;
  }

  const {
    positionExpr,
    positionIdentifiers,
    useVpiFilter,
    handleIdentifierTypeChange,
    updateVPI,
    updateVPT,
    updateField
  } = usePositionData(expression, updateExpression);

  return (
    <div className="space-y-3">
      <PositionFieldSelector 
        field={positionExpr.field || ''}
        updateField={updateField}
        required={required}
      />

      <FilterTypeSwitch 
        useVpiFilter={useVpiFilter}
        onChange={handleIdentifierTypeChange}
      />

      {useVpiFilter ? (
        <PositionIdSelector 
          vpi={positionExpr.vpi || '_any'}
          updateVPI={updateVPI}
          vpiOptions={positionIdentifiers.vpiOptions}
        />
      ) : (
        <PositionTagSelector 
          vpt={positionExpr.vpt || '_any'}
          updateVPT={updateVPT}
          vptOptions={positionIdentifiers.vptOptions}
        />
      )}
    </div>
  );
};

export default PositionDataExpressionEditor;
