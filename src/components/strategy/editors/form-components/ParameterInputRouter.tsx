
import React from 'react';
import { IndicatorParameter } from '../../utils/indicatorConfig';
import NumberParameterInput from './NumberParameterInput';
import DropdownParameterInput from './DropdownParameterInput';
import CheckboxGroupParameterInput from './CheckboxGroupParameterInput';
import RadioButtonParameterInput from './RadioButtonParameterInput';
import BooleanParameterInput from './BooleanParameterInput';

interface ParameterInputRouterProps {
  param: IndicatorParameter;
  value: any;
  onChange: (value: any) => void;
}

const ParameterInputRouter: React.FC<ParameterInputRouterProps> = ({
  param,
  value,
  onChange
}) => {
  // Set default value if undefined
  const inputValue = value !== undefined ? value : param.default;
  
  switch (param.type) {
    case 'number':
      return (
        <NumberParameterInput 
          param={param} 
          value={inputValue} 
          onChange={onChange} 
        />
      );
      
    case 'dropdown':
      return (
        <DropdownParameterInput 
          param={param} 
          value={inputValue} 
          onChange={onChange} 
        />
      );
      
    case 'checkbox_group':
      return (
        <CheckboxGroupParameterInput 
          param={param} 
          value={inputValue || []} 
          onChange={onChange} 
        />
      );
      
    case 'radio_button':
      return (
        <RadioButtonParameterInput 
          param={param} 
          value={inputValue} 
          onChange={onChange} 
        />
      );
      
    case 'boolean':
      return (
        <BooleanParameterInput 
          param={param} 
          value={inputValue} 
          onChange={onChange} 
        />
      );
      
    default:
      return null;
  }
};

export default ParameterInputRouter;
