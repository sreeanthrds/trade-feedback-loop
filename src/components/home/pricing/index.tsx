
import React from 'react';
import PricingPlan from './PricingPlan';
import PointsInfo from './PointsInfo';
import { getFreePlan, getPointsPlans } from './PricingData';

const Pricing = () => {
  const freePlan = getFreePlan();
  const pointsPlans = getPointsPlans();

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple Points-Based Pricing
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            Buy points to access premium features and extend your trading capabilities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-slide-up">
            <PricingPlan {...freePlan} />
          </div>
          
          {pointsPlans.map((plan, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
              <PricingPlan {...plan} />
            </div>
          ))}
        </div>
        
        <PointsInfo />
      </div>
    </section>
  );
};

export default Pricing;
