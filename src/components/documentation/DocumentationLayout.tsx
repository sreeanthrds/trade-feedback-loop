
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocNavigation from './DocNavigation';
import Introduction from './sections/Introduction';
import StrategyBuilderDoc from './sections/StrategyBuilderDoc';
import NodeTypesDoc from './sections/NodeTypesDoc';
import SignalNodesDoc from './sections/SignalNodesDoc';
import ActionNodesDoc from './sections/ActionNodesDoc';
import BacktestingDoc from './sections/BacktestingDoc';
import ReportsDoc from './sections/ReportsDoc';

const DocumentationLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const renderContent = () => {
    switch(activeSection) {
      case 'introduction':
        return <Introduction />;
      case 'strategy-builder':
        return <StrategyBuilderDoc />;
      case 'node-types':
        return <NodeTypesDoc />;
      case 'signal-nodes':
        return <SignalNodesDoc />;
      case 'action-nodes':
        return <ActionNodesDoc />;
      case 'backtesting':
        return <BacktestingDoc />;
      case 'reports':
        return <ReportsDoc />;
      default:
        return <Introduction />;
    }
  };

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <ScrollArea className="h-full py-6 pr-6">
          <DocNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
        </ScrollArea>
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8">
        <ScrollArea className="max-h-[calc(100vh-8rem)]">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default DocumentationLayout;
