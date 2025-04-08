
import React from 'react';

const NodeTypesDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Node Types</h1>
      
      <p className="text-muted-foreground">
        The Strategy Builder uses different types of nodes to represent various components of a trading strategy.
        Each node type serves a specific purpose and has unique configuration options.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Overview of Node Types</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Start Node</h3>
          <p>
            The Start Node is the entry point of every strategy. It defines the fundamental settings for the strategy.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Initialize strategy and define global settings</li>
            <li><strong>Settings:</strong> Trading instrument, timeframe, exchange, and technical indicators</li>
            <li><strong>Connections:</strong> Can connect to Signal Nodes or Action Nodes</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Signal Nodes</h3>
          <p>
            Signal Nodes define the conditions that trigger entry or exit signals in your strategy.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Entry Signal Node:</strong> Generates entry signals based on defined conditions</li>
            <li><strong>Exit Signal Node:</strong> Generates exit signals based on defined conditions</li>
            <li><strong>Signal Node:</strong> Can generate both entry and exit signals based on separate condition sets</li>
            <li><strong>Settings:</strong> Condition builder with support for indicators, price data, and logical operators</li>
            <li><strong>Connections:</strong> Typically connect to Action Nodes</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Action Nodes</h3>
          <p>
            Action Nodes define what happens when a signal is triggered. They handle order execution and position management.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Entry Node:</strong> Opens new positions when connected signals are triggered</li>
            <li><strong>Exit Node:</strong> Closes existing positions when connected signals are triggered</li>
            <li><strong>Modify Node:</strong> Adjusts existing positions (e.g., changing stop-loss or take-profit levels)</li>
            <li><strong>Alert Node:</strong> Generates notifications without executing trades</li>
            <li><strong>Settings:</strong> Order types, quantities, product types, and position management rules</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Flow Control Nodes</h3>
          <p>
            Flow Control Nodes manage the execution path of your strategy.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>End Node:</strong> Marks the end of a strategy branch</li>
            <li><strong>Force End Node:</strong> Immediately terminates strategy execution when reached</li>
            <li><strong>Retry Node:</strong> Reprocesses a strategy branch after a specified condition is met</li>
          </ul>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight">Node Connections</h2>
        <p>
          Nodes are connected to define the flow of your strategy. Each connection represents a path of execution from one node to another.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Connection Types:</strong> Standard connections, conditional connections, and filtered connections</li>
          <li><strong>Creating Connections:</strong> Click and drag from an output handle to an input handle</li>
          <li><strong>Valid Connections:</strong> Not all node types can connect to each other; the system only allows valid connections</li>
          <li><strong>Deleting Connections:</strong> Click on a connection to select it, then press Delete or use the delete button</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Node Configuration</h2>
        <p>
          Each node type has unique configuration options accessible by clicking on the node.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Node Panel:</strong> Opens when a node is selected, displaying configuration options</li>
          <li><strong>Validation:</strong> The system validates node settings to ensure they're complete and valid</li>
          <li><strong>Dependencies:</strong> Some nodes may reference data or settings from other nodes</li>
        </ul>
      </div>
    </div>
  );
};

export default NodeTypesDoc;
