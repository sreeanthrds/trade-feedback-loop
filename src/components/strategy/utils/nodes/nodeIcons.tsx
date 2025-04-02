
import React from 'react';
import { 
  ArrowRight, 
  ArrowRightLeft, 
  Bell, 
  LogIn, 
  LogOut, 
  PlayCircle,
  AlertTriangle,
  StopCircle,
  PowerOff
} from 'lucide-react';

export const getNodeIcon = (nodeType: string, customSize: number = 4) => {
  const iconProps = { className: `h-${customSize} w-${customSize}` };

  switch (nodeType) {
    case 'startNode':
      return <PlayCircle className={`${iconProps.className} text-green-600`} />;
      
    case 'signalNode':
      return <ArrowRight className={`${iconProps.className} text-blue-500`} />;
      
    case 'entry':
    case 'entryNode':
      return <LogIn className={`${iconProps.className} text-green-500`} />;
      
    case 'exit':
    case 'exitNode':
      return <LogOut className={`${iconProps.className} text-red-500`} />;
      
    case 'alert':
    case 'alertNode':
      return <Bell className={`${iconProps.className} text-amber-500`} />;
      
    case 'modify':
    case 'modifyNode':
      return <ArrowRightLeft className={`${iconProps.className} text-blue-500`} />;
      
    case 'endNode':
      return <StopCircle className={`${iconProps.className} text-rose-600`} />;
      
    case 'forceEndNode':
      return <AlertTriangle className={`${iconProps.className} text-purple-500`} />;
      
    default:
      return <ArrowRight className={`${iconProps.className} text-gray-500`} />;
  }
};
