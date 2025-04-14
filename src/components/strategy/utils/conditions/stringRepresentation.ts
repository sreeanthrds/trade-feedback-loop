import { Expression, Condition, GroupCondition } from './types';

// Helper function to get display name for indicators (similar to StartNode.tsx)
export const getIndicatorDisplayName = (key: string, nodeData?: any): string => {
  if (!nodeData || !nodeData.indicatorParameters) return key;
  
  // Extract base indicator name (before any underscore)
  const baseName = key.split('_')[0];
  
  if (nodeData.indicatorParameters[key]) {
    const params = nodeData.indicatorParameters[key];
    
    // Format all parameters into a single, readable string - only values
    const paramList = Object.values(params).join(',');
    
    return `${baseName}(${paramList})`;
  }
  
  return key;
};

// Helper function to get the instrument name from node data
const getInstrumentName = (nodeData?: any): string => {
  if (!nodeData) return 'Instrument';
  
  // Return the symbol from node data or a default if not found
  return nodeData.symbol || 'Instrument';
};

// Convert an expression to a readable string
export const expressionToString = (expr: Expression, nodeData?: any): string => {
  switch (expr.type) {
    case 'indicator':
      let indicatorDisplay = '';
      if (nodeData) {
        indicatorDisplay = getIndicatorDisplayName(expr.name, nodeData);
      } else {
        indicatorDisplay = expr.parameter ? `${expr.name}[${expr.parameter}]` : expr.name;
      }
      
      // Add offset display if present (using the same logic as market_data)
      if (expr.offset && expr.offset < 0) {
        if (expr.offset === -1) {
          indicatorDisplay = `Previous ${indicatorDisplay}`;
        } else {
          indicatorDisplay = `${Math.abs(expr.offset)} candles ago ${indicatorDisplay}`;
        }
      }
      return indicatorDisplay;
    
    case 'market_data':
      // Get instrument name from node data, defaults to "Instrument" if not found
      const instrumentName = getInstrumentName(nodeData);
      
      // Create a field display with the instrument name prefix
      let fieldDisplay = `${instrumentName}.${expr.field}`;
      if (expr.sub_indicator) {
        fieldDisplay = `${fieldDisplay}.${expr.sub_indicator}`;
      }
      
      // Add offset display if present
      if (expr.offset && expr.offset < 0) {
        if (expr.offset === -1) {
          fieldDisplay = `Previous ${fieldDisplay}`;
        } else {
          fieldDisplay = `${Math.abs(expr.offset)} candles ago ${fieldDisplay}`;
        }
      }
      return fieldDisplay;
    
    case 'constant':
      return `${expr.value}`;
    
    case 'time_function':
      return expr.function;
    
    case 'position_data':
      let positionContext = '';
      if (expr.vpi === '_any' && expr.vpt === '_any') {
        positionContext = '(All Positions)';
      } else if (expr.vpi === '_any' && expr.vpt) {
        positionContext = `(Tag:${expr.vpt})`;
      } else if (expr.vpi && expr.vpi !== '_any') {
        // If specific VPI is selected, only show that (as it implies a specific VPT)
        positionContext = `(ID:${expr.vpi})`;
      }
      return `${expr.field}${positionContext}`;
    
    case 'strategy_metric':
      return `Strategy.${expr.metric}`;
    
    case 'execution_data':
      const orderRef = expr.vpi ? `(Order:${expr.vpi})` : '';
      return `${expr.field}${orderRef}`;
    
    case 'external_trigger':
      return `Trigger.${expr.triggerType}`;
    
    case 'expression':
      const leftStr = expressionToString(expr.left, nodeData);
      const rightStr = expressionToString(expr.right, nodeData);
      
      // Handle percentage operations with special formatting
      if (expr.operation === '+%') {
        return `(${leftStr} increased by ${rightStr}%)`;
      } else if (expr.operation === '-%') {
        return `(${leftStr} decreased by ${rightStr}%)`;
      }
      
      return `(${leftStr} ${expr.operation} ${rightStr})`;
    
    default:
      return '';
  }
};

// Convert a condition to a readable string
export const conditionToString = (condition: Condition, nodeData?: any): string => {
  const lhsStr = expressionToString(condition.lhs, nodeData);
  const rhsStr = expressionToString(condition.rhs, nodeData);
  return `${lhsStr} ${condition.operator} ${rhsStr}`;
};

// Convert a group condition to a readable string
export const groupConditionToString = (group: GroupCondition, nodeData?: any): string => {
  if (!group.conditions || group.conditions.length === 0) {
    return '(empty)';
  }
  
  const conditionsStr = group.conditions.map(cond => {
    if ('groupLogic' in cond) {
      return `(${groupConditionToString(cond as GroupCondition, nodeData)})`;
    } else {
      return conditionToString(cond as Condition, nodeData);
    }
  }).join(` ${group.groupLogic} `);
  
  return conditionsStr;
};
