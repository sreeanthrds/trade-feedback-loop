
import React from 'react';
import { InfoBox } from '../shared';

interface InfoMessageProps {
  actionType?: 'entry' | 'exit' | 'alert';
}

const InfoMessage: React.FC<InfoMessageProps> = ({ actionType }) => {
  const getMessage = () => {
    switch (actionType) {
      case 'entry':
        return "Entry nodes open new positions when the strategy detects a signal. Configure quantity and order details based on your trading preferences.";
      case 'exit':
        return "Exit nodes close existing positions. Use these after entry nodes to define when to exit the market based on signals.";
      case 'alert':
        return "Alert nodes notify you of trading opportunities without executing trades. Useful for manual trading or when testing a strategy.";
      default:
        return "Action nodes execute trades or generate notifications when connected to signal nodes in your strategy.";
    }
  };

  return (
    <InfoBox>
      {getMessage()}
    </InfoBox>
  );
};

export default InfoMessage;
