
import React from 'react';

const Introduction: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Trading Strategy Builder Documentation</h1>
      
      <p className="text-muted-foreground">
        Welcome to the comprehensive documentation for the Trading Strategy Builder platform.
        This guide provides detailed information on all features and functionalities of the application.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p>
          The Trading Strategy Builder is a powerful visual programming environment that enables traders to design,
          test, and analyze trading strategies without writing code. By connecting nodes in a flowchart-like interface,
          you can create complex trading logic, test it against historical data, and analyze the results.
        </p>
        
        <h3 className="text-xl font-bold tracking-tight">Core Features</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Visual Strategy Builder:</strong> Drag-and-drop interface for creating trading strategies</li>
          <li><strong>Signal Nodes:</strong> Define entry and exit conditions based on indicators, price action, and more</li>
          <li><strong>Action Nodes:</strong> Configure order placement, position management, and alerts</li>
          <li><strong>Backtesting Engine:</strong> Test strategies against historical data with realistic simulations</li>
          <li><strong>Performance Reports:</strong> Detailed analytics and visualizations of strategy performance</li>
          <li><strong>Position Management:</strong> Track and manage multiple positions with visual feedback</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Getting Started</h3>
        <p>
          To begin using the Trading Strategy Builder, navigate to the Strategy Builder page and create your first strategy.
          Start by adding a Start Node, which serves as the entry point for your strategy, then add Signal and Action nodes
          to define your trading logic. Once your strategy is complete, use the Backtesting features to evaluate its performance.
        </p>
        
        <p>
          This documentation is organized by feature area. Use the navigation panel on the left to explore detailed information
          about each component of the platform.
        </p>
      </div>
    </div>
  );
};

export default Introduction;
