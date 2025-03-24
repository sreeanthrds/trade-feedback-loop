
import React from 'react';
import { Node } from '@xyflow/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStartNodeForm } from './start-node/useStartNodeForm';
import BasicSettingsTab from './start-node/BasicSettingsTab';
import IndicatorsTab from './start-node/IndicatorsTab';

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
  
  return (
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
  );
};

export default StartNodeEditor;
