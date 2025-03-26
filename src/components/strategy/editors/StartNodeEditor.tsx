
import React from 'react';
import { Node } from '@xyflow/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStartNodeForm } from './start-node/useStartNodeForm';
import BasicSettingsTab from './start-node/BasicSettingsTab';
import IndicatorsTab from './start-node/IndicatorsTab';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StartNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const StartNodeEditor = ({ node, updateNodeData }: StartNodeEditorProps) => {
  const { 
    formData, 
    handleInputChange, 
    handleTradingInstrumentChange, 
    handleUnderlyingTypeChange, 
    handleIndicatorsChange
  } = useStartNodeForm({ node, updateNodeData });
  
  const startNodeInfo = "The Start Node is the entry point of your strategy. Configure basic settings here and add technical indicators in the Indicators tab.";
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium">Strategy Settings</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{startNodeInfo}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <BasicSettingsTab 
            formData={formData}
            handleInputChange={handleInputChange}
            handleTradingInstrumentChange={handleTradingInstrumentChange}
            handleUnderlyingTypeChange={handleUnderlyingTypeChange}
          />
        </TabsContent>
        
        <TabsContent value="indicators">
          <IndicatorsTab 
            indicatorParameters={formData.indicatorParameters || {}}
            onIndicatorsChange={handleIndicatorsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StartNodeEditor;
