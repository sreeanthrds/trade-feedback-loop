
import { UsageReference } from '../../../utils/dependency-tracking/types';

export interface UseIndicatorManagementProps {
  selectedIndicators: Record<string, Record<string, any>>;
  onChange: (indicators: Record<string, Record<string, any>>) => void;
}

export interface IndicatorManagementState {
  selectedIndicator: string;
  openStates: Record<string, boolean>;
}

export interface IndicatorManagementHandlers {
  setSelectedIndicator: (indicator: string) => void;
  handleAddIndicator: (newIndicator: any) => void;
  handleRemoveIndicator: (indicatorName: string) => void;
  handleParameterChange: (indicatorName: string, paramName: string, value: any) => void;
  toggleOpen: (indicatorName: string) => void;
  findUsages: (indicatorName: string) => UsageReference[];
}

export type IndicatorManagementReturn = IndicatorManagementState & IndicatorManagementHandlers;
