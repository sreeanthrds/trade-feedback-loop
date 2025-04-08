
import React from 'react';
import { Button } from '@/components/ui/button';

interface DocNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DocNavigation: React.FC<DocNavigationProps> = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'introduction', name: 'Introduction' },
    { id: 'strategy-builder', name: 'Strategy Builder' },
    { id: 'node-types', name: 'Node Types' },
    { id: 'signal-nodes', name: 'Signal Nodes' },
    { id: 'action-nodes', name: 'Action Nodes' },
    { id: 'backtesting', name: 'Backtesting' },
    { id: 'reports', name: 'Reports & Analytics' },
  ];

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium mb-4">Documentation</div>
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "secondary" : "ghost"}
          className="w-full justify-start text-sm"
          onClick={() => setActiveSection(section.id)}
        >
          {section.name}
        </Button>
      ))}
    </div>
  );
};

export default DocNavigation;
