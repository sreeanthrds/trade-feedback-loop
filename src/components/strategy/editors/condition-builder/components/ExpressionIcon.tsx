
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
      return <ArrowUpDown className={className} />;
    }
  }
  
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
