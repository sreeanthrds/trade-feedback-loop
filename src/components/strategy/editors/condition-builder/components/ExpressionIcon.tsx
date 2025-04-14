
import React from 'react';
import { 
  LineChart, 
  Gauge, 
  DollarSign, 
  Clock, 
  CodeXml,
  Briefcase,
  BarChart,
  ShoppingCart,
  Bell
} from 'lucide-react';
import { ExpressionType } from '../../../utils/conditions';

interface ExpressionIconProps {
  type: ExpressionType;
  subType?: string;
  className?: string;
}

const ExpressionIcon: React.FC<ExpressionIconProps> = ({ 
  type, 
  subType,
  className = 'h-3.5 w-3.5 text-muted-foreground' 
}) => {
  const iconProps = { className };
  
  // Get the current instrument from subType if available
  const getFormattedType = (): string => {
    if (type === 'market_data') {
      return 'Instrument Price';
    }
    return type.replace('_', ' ');
  };
  
  switch (type) {
    case 'market_data':
      return <LineChart {...iconProps} />;
    case 'indicator':
      return <Gauge {...iconProps} />;
    case 'constant':
      return <DollarSign {...iconProps} />;
    case 'time_function':
      return <Clock {...iconProps} />;
    case 'position_data':
      return <Briefcase {...iconProps} />;
    case 'strategy_metric':
      return <BarChart {...iconProps} />;
    case 'execution_data':
      return <ShoppingCart {...iconProps} />;
    case 'external_trigger':
      return <Bell {...iconProps} />;
    case 'expression':
      return <CodeXml {...iconProps} />;
    default:
      return <LineChart {...iconProps} />;
  }
};

export default ExpressionIcon;
