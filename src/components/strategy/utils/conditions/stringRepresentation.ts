
import { Expression, Condition, GroupCondition } from './types';

// Helper function to get display name for indicators (similar to StartNode.tsx)
export const getIndicatorDisplayName = (key: string, nodeData?: any): string => {
  if (!key) return 'Unknown indicator';
  if (!nodeData || !nodeData.indicatorParameters) return key;
  
  try {
    // Extract base indicator name (before any underscore)
    const baseName = key.split('_')[0];
    
    if (nodeData.indicatorParameters[key]) {
      const params = nodeData.indicatorParameters[key];
      
      // Create a copy without indicator_name if it exists
      const displayParams = { ...params };
      delete displayParams.indicator_name;
      
      // Check if there are any valid parameter values to display
      const paramValues = Object.values(displayParams);
      const hasValidParams = paramValues.length > 0 && 
        paramValues.some(val => val !== undefined && val !== null && val !== '');
      
      // Only include parameters if there are valid values
      if (hasValidParams) {
        const paramList = paramValues.join(',');
        return `${baseName}(${paramList})`;
      }
      
      // Return just the base name if no valid parameters
      return baseName;
    }
    
    return key;
  } catch (error) {
    console.error(`Error formatting indicator name for ${key}:`, error);
    return key;
  }
};

// Helper function to get the instrument name from node data
const getInstrumentName = (nodeData?: any): string => {
  if (!nodeData) return 'Instrument';
  
  // Return the symbol from node data or a default if not found
  return nodeData.symbol || 'Instrument';
};

// Convert an expression to a readable string
export const expressionToString = (expr: Expression, nodeData?: any): string => {
  if (!expr || !expr.type) {
    console.warn("Invalid expression structure:", expr);
    return "Invalid expression";
  }

  try {
    switch (expr.type) {
      case 'indicator':
        let indicatorDisplay = '';
        if (nodeData && expr.name) {
          indicatorDisplay = getIndicatorDisplayName(expr.name, nodeData);
        } else {
          indicatorDisplay = expr.parameter ? `${expr.name || 'Unknown'}[${expr.parameter}]` : (expr.name || 'Unknown');
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
        let fieldDisplay = `${instrumentName}.${expr.field || 'unknown'}`;
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
        return `${expr.value !== undefined ? expr.value : '0'}`;
      
      case 'time_function':
        return expr.function || 'Unknown time function';
      
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
        return `${expr.field || 'Unknown field'}${positionContext}`;
      
      case 'strategy_metric':
        return `Strategy.${expr.metric || 'Unknown metric'}`;
      
      case 'execution_data':
        const orderRef = expr.vpi ? `(Order:${expr.vpi})` : '';
        return `${expr.field || 'Unknown field'}${orderRef}`;
      
      case 'external_trigger':
        return `Trigger.${expr.triggerType || 'Unknown trigger'}`;
      
      case 'expression':
        if (!expr.left || !expr.right) {
          return '(Incomplete expression)';
        }
        
        const leftStr = expressionToString(expr.left, nodeData);
        const rightStr = expressionToString(expr.right, nodeData);
        
        // Handle percentage operations with special formatting
        if (expr.operation === '+%') {
          return `(${leftStr} increased by ${rightStr}%)`;
        } else if (expr.operation === '-%') {
          return `(${leftStr} decreased by ${rightStr}%)`;
        }
        
        return `(${leftStr} ${expr.operation || '?'} ${rightStr})`;
      
      default:
        return 'Unknown expression type';
    }
  } catch (error) {
    console.error("Error in expressionToString:", error);
    return "Invalid expression format";
  }
};

// Convert a condition to a readable string
export const conditionToString = (condition: Condition, nodeData?: any): string => {
  if (!condition || !condition.lhs || !condition.rhs) {
    console.warn("Invalid condition structure:", condition);
    return "Invalid condition";
  }
  
  try {
    const lhsStr = expressionToString(condition.lhs, nodeData);
    const rhsStr = expressionToString(condition.rhs, nodeData);
    return `${lhsStr} ${condition.operator || '?'} ${rhsStr}`;
  } catch (error) {
    console.error("Error in conditionToString:", error);
    return "Invalid condition format";
  }
};

// Convert a group condition to a readable string
export const groupConditionToString = (group: GroupCondition, nodeData?: any): string => {
  if (!group || !group.conditions || group.conditions.length === 0) {
    return '(empty)';
  }
  
  try {
    const conditionsStr = group.conditions.map(cond => {
      if (!cond) {
        return 'Invalid condition';
      }
      
      if ('groupLogic' in cond) {
        return `(${groupConditionToString(cond as GroupCondition, nodeData)})`;
      } else {
        return conditionToString(cond as Condition, nodeData);
      }
    }).join(` ${group.groupLogic || 'AND'} `);
    
    return conditionsStr;
  } catch (error) {
    console.error("Error in groupConditionToString:", error);
    return '(error parsing conditions)';
  }
};
