
import React from 'react';
import { ExpressionType } from '../../../utils/conditionTypes';
import { Activity, Calculator, Clock, LineChart, Hash, ArrowUpDown } from 'lucide-react';

interface ExpressionIconProps {
  type: ExpressionType;
  className?: string;
  subType?: string;
}

const ExpressionIcon: React.FC<ExpressionIconProps> = ({
  type,
  className = "h-4 w-4",
  subType
}) => {
  // Special case for multi-output indicators
  if (type === 'indicator' && subType) {
    if (subType.includes('Band') || subType.includes('UpperBand') || subType.includes('LowerBand') || subType.includes('MiddleBand')) {
      return <ArrowUpDown className={`${className} text-indigo-600 dark:text-indigo-400`} />;
    }
  }
  
  switch (type) {
    case 'indicator':
      return <Activity className={`${className} text-blue-600 dark:text-blue-400`} />;
    case 'market_data':
      return <LineChart className={`${className} text-green-600 dark:text-green-400`} />;
    case 'constant':
      return <Hash className={`${className} text-amber-600 dark:text-amber-400`} />;
    case 'time_function':
      return <Clock className={`${className} text-purple-600 dark:text-purple-400`} />;
    case 'expression':
      return <Calculator className={`${className} text-rose-600 dark:text-rose-400`} />;
    default:
      return null;
  }
};

export default ExpressionIcon;
