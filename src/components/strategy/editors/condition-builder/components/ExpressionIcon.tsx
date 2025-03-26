
import React from 'react';
import { 
  TrendingUp, 
  LineChart, 
  Hash, 
  Clock, 
  Calculator, 
  Sigma, 
  SlidersHorizontal,
  BarChart 
} from 'lucide-react';
import { ExpressionType } from '../../../utils/conditionTypes';

interface ExpressionIconProps {
  type: ExpressionType;
  subType?: string;
}

const ExpressionIcon: React.FC<ExpressionIconProps> = ({
  type,
  subType
}) => {
  // Base icon based on expression type
  const renderBaseIcon = () => {
    switch (type) {
      case 'indicator':
        return <TrendingUp className="h-3.5 w-3.5 text-blue-500" />;
      
      case 'market_data':
        return <LineChart className="h-3.5 w-3.5 text-green-500" />;
      
      case 'constant':
        return <Hash className="h-3.5 w-3.5 text-purple-500" />;
      
      case 'time_function':
        return <Clock className="h-3.5 w-3.5 text-orange-500" />;
      
      case 'expression':
        return <Calculator className="h-3.5 w-3.5 text-red-500" />;
      
      default:
        return <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />;
    }
  };
  
  // Specialized icon for indicator subtypes
  const renderIndicatorSubType = () => {
    if (type !== 'indicator' || !subType) return null;
    
    // We could add even more specific icons for different indicator outputs
    switch (subType) {
      case 'Signal':
        return <Sigma className="h-3 w-3 text-indigo-400" />;
      
      case 'Histogram':
        return <BarChart className="h-3 w-3 text-indigo-400" />;
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {renderBaseIcon()}
      {renderIndicatorSubType()}
    </div>
  );
};

export default ExpressionIcon;
