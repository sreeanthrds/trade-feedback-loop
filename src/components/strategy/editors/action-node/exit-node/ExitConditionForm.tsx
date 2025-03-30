
import React from 'react';
import { ExitCondition } from './types';
import {
  PositionExitForm,
  AllPositionsExitForm,
  PnlExitForm,
  PercentageChangeExitForm,
  PriceTargetExitForm,
  IndicatorExitForm,
  TimeBasedExitForm,
  MarketCloseExitForm,
  LimitToMarketExitForm,
  RollingExitForm
} from './condition-forms';

interface ExitConditionFormProps {
  exitCondition: ExitCondition;
  updateField: (field: string, value: any) => void;
}

const ExitConditionForm: React.FC<ExitConditionFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  // Render different form components based on exit condition type
  switch (exitCondition.type) {
    case 'vpi':
    case 'vpt':
      return (
        <PositionExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'all_positions':
      return <AllPositionsExitForm />;
      
    case 'realized_pnl':
    case 'unrealized_pnl':
      return (
        <PnlExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'premium_change':
    case 'position_value_change':
      return (
        <PercentageChangeExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'price_target':
      return (
        <PriceTargetExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'indicator_underlying':
    case 'indicator_contract':
      return (
        <IndicatorExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'time_based':
      return (
        <TimeBasedExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'market_close':
      return (
        <MarketCloseExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'limit_to_market':
      return (
        <LimitToMarketExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    case 'rolling':
      return (
        <RollingExitForm 
          exitCondition={exitCondition as any} 
          updateField={updateField} 
        />
      );
      
    default:
      return null;
  }
};

export default ExitConditionForm;
