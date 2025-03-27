
import React, { useState } from 'react';
import { indicatorConfig } from '../utils/indicatorConfig';
import AddIndicatorForm from './indicators/AddIndicatorForm';
import SelectedIndicator from './indicators/SelectedIndicator';
import NoIndicatorsMessage from './indicators/NoIndicatorsMessage';
import { toast } from "@/hooks/use-toast";
import { useReactFlow } from '@xyflow/react';
import { findIndicatorUsages } from '../utils/dependency-tracking/usageFinder';

interface IndicatorSelectorProps {
  selectedIndicators: Record<string, Record<string, any>>;
  onChange: (indicators: Record<string, Record<string, any>>) => void;
}

const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({
  selectedIndicators,
  onChange,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>("");
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const { getNodes, setNodes } = useReactFlow();
  
  const handleAddIndicator = () => {
    if (!selectedIndicator) return;
    
    const newIndicator = indicatorConfig[selectedIndicator];
    
    const defaultValues = newIndicator.parameters.reduce((acc, param) => {
      acc[param.name] = param.default;
      return acc;
    }, {} as Record<string, any>);
    
    const baseIndicatorName = selectedIndicator;
    let uniqueKey = baseIndicatorName;
    let counter = 1;
    
    while (selectedIndicators[uniqueKey]) {
      uniqueKey = `${baseIndicatorName}_${counter}`;
      counter++;
    }
    
    const updatedIndicators = {
      ...selectedIndicators,
      [uniqueKey]: defaultValues
    };
    
    onChange(updatedIndicators);
    
    setOpenStates({
      ...openStates,
      [uniqueKey]: true
    });
    
    setSelectedIndicator("");
    
    toast({
      title: "Indicator added",
      description: `Added ${baseIndicatorName} indicator`
    });
  };
  
  const handleRemoveIndicator = (indicatorName: string) => {
    // Create a new object without the deleted indicator
    const { [indicatorName]: removed, ...rest } = selectedIndicators;
    
    // Update indicator parameters in start node
    onChange(rest);
    
    // We also need to update any nodes that are using this indicator
    // by removing any conditions that reference the deleted indicator
    const allNodes = getNodes();
    
    const updatedNodes = allNodes.map(node => {
      if (node.type === 'signalNode' && node.data && node.data.condition) {
        // Clean up signal node conditions that use this indicator
        const cleanedNode = cleanNodeConditionsOfIndicator(node, indicatorName);
        return cleanedNode;
      }
      return node;
    });
    
    // Update nodes if any changes were made
    if (JSON.stringify(allNodes) !== JSON.stringify(updatedNodes)) {
      setNodes(updatedNodes);
    }
    
    toast({
      title: "Indicator removed",
      description: `Removed ${indicatorName.split('_')[0]} indicator`
    });
  };
  
  // Helper function to recursively clean conditions that use a deleted indicator
  const cleanNodeConditionsOfIndicator = (node: any, indicatorName: string) => {
    if (!node.data.condition) return node;
    
    // Create a deep copy of the node to modify
    const updatedNode = { ...node, data: { ...node.data } };
    
    const cleanCondition = (condition: any): any => {
      if (!condition) return condition;
      
      // For group conditions, recursively clean child conditions
      if (condition.groupLogic && condition.conditions) {
        // Clean each condition in the group
        const cleanedConditions = condition.conditions
          .map(cleanCondition)
          .filter(Boolean); // Remove any null/undefined results
        
        // If no conditions left, return null (this group will be removed)
        if (cleanedConditions.length === 0) {
          return null;
        }
        
        return {
          ...condition,
          conditions: cleanedConditions
        };
      } 
      
      // For single conditions, check if indicator is used in either side
      const lhsUsesDeletedIndicator = 
        condition.lhs?.type === 'indicator' && 
        condition.lhs?.name === indicatorName;
        
      const rhsUsesDeletedIndicator = 
        condition.rhs?.type === 'indicator' && 
        condition.rhs?.name === indicatorName;
      
      // If this condition uses the deleted indicator, remove it
      if (lhsUsesDeletedIndicator || rhsUsesDeletedIndicator) {
        return null;
      }
      
      // Also check complex expressions
      if (condition.lhs?.type === 'expression') {
        const cleanedLhs = cleanExpression(condition.lhs, indicatorName);
        if (!cleanedLhs) {
          return null;
        }
        condition = { ...condition, lhs: cleanedLhs };
      }
      
      if (condition.rhs?.type === 'expression') {
        const cleanedRhs = cleanExpression(condition.rhs, indicatorName);
        if (!cleanedRhs) {
          return null;
        }
        condition = { ...condition, rhs: cleanedRhs };
      }
      
      return condition;
    };
    
    // Helper to clean expressions
    const cleanExpression = (expr: any, indicatorName: string): any => {
      if (!expr) return expr;
      
      // Check if this expression directly uses the indicator
      if (expr.type === 'indicator' && expr.name === indicatorName) {
        return null;
      }
      
      // For complex expressions, check both sides
      if (expr.type === 'expression') {
        const cleanedLeft = cleanExpression(expr.left, indicatorName);
        const cleanedRight = cleanExpression(expr.right, indicatorName);
        
        // If either side is null, the expression is invalid
        if (!cleanedLeft || !cleanedRight) {
          return null;
        }
        
        return {
          ...expr,
          left: cleanedLeft,
          right: cleanedRight
        };
      }
      
      return expr;
    };
    
    // Clean the root condition
    const cleanedCondition = cleanCondition(updatedNode.data.condition);
    
    // If the entire condition was removed, set to a default empty condition
    updatedNode.data.condition = cleanedCondition || {
      id: `group_${Math.random().toString(36).substr(2, 9)}`,
      groupLogic: 'AND',
      conditions: []
    };
    
    return updatedNode;
  };
  
  const handleParameterChange = (indicatorName: string, paramName: string, value: any) => {
    const updatedIndicators = {
      ...selectedIndicators,
      [indicatorName]: {
        ...selectedIndicators[indicatorName],
        [paramName]: value
      }
    };
    
    onChange(updatedIndicators);
  };
  
  const toggleOpen = (indicatorName: string) => {
    setOpenStates({
      ...openStates,
      [indicatorName]: !openStates[indicatorName]
    });
  };
  
  return (
    <div className="space-y-4">
      <AddIndicatorForm
        selectedIndicator={selectedIndicator}
        onSelectIndicator={setSelectedIndicator}
        onAddIndicator={handleAddIndicator}
      />
      
      {Object.keys(selectedIndicators).length > 0 ? (
        <div className="space-y-3">
          {Object.keys(selectedIndicators).map((name) => (
            <SelectedIndicator
              key={name}
              name={name}
              values={selectedIndicators[name]}
              isOpen={openStates[name] || false}
              onToggle={() => toggleOpen(name)}
              onRemove={() => handleRemoveIndicator(name)}
              onParameterChange={(paramName, value) => 
                handleParameterChange(name, paramName, value)
              }
            />
          ))}
        </div>
      ) : (
        <NoIndicatorsMessage />
      )}
    </div>
  );
};

export default IndicatorSelector;
