
import React from 'react';
import { ExpressionType } from '../../../utils/conditionTypes';
import { Activity, Calculator, Clock, LineChart, Hash } from 'lucide-react';

interface ExpressionIconProps {
  type: ExpressionType;
  className?: string;
}

const ExpressionIcon: React.FC<ExpressionIconProps> = ({
  type,
  className = "h-4 w-4"
}) => {
  switch (type) {
    case 'indicator':
      return <Activity className={className} />;
    case 'market_data':
      return <LineChart className={className} />;
    case 'constant':
      return <Hash className={className} />;
    case 'time_function':
      return <Clock className={className} />;
    case 'expression':
      return <Calculator className={className} />;
    default:
      return null;
  }
};

export default ExpressionIcon;
