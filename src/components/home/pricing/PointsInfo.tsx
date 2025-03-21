
import React from 'react';
import { Check } from 'lucide-react';

const PointsInfo = () => {
  return (
    <div className="mt-16 p-6 bg-secondary/20 rounded-xl max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">How Points Work</h3>
      <p className="text-foreground/70 mb-4">
        Points are the currency within Trady that allow you to access premium features:
      </p>
      <ul className="space-y-2 mb-4">
        <li className="flex items-start">
          <Check className="h-5 w-5 text-success shrink-0 mr-3 mt-0.5" />
          <span>1 backtesting session = 100 points</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-success shrink-0 mr-3 mt-0.5" />
          <span>Advanced indicator access = 50 points per indicator</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-success shrink-0 mr-3 mt-0.5" />
          <span>Report exports = 25 points per report</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-success shrink-0 mr-3 mt-0.5" />
          <span>Points never expire - use them at your convenience</span>
        </li>
      </ul>
      <p className="text-foreground/70 text-center text-sm">
        All prices are inclusive of applicable taxes. GST invoice will be provided.
      </p>
    </div>
  );
};

export default PointsInfo;
