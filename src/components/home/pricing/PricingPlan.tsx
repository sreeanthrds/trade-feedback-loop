
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, AlertCircle, Coins } from 'lucide-react';

export interface PlanFeature {
  title: string;
  included: boolean;
}

export interface PricingPlanProps {
  title: string;
  price: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
  isPoints?: boolean;
}

const PricingPlan = ({ 
  title, 
  price, 
  description, 
  features, 
  ctaText, 
  ctaLink, 
  popular = false,
  isPoints = false
}: PricingPlanProps) => {
  return (
    <div 
      className={`rounded-2xl p-1 ${popular ? 'bg-gradient-to-b from-success to-success/50' : ''}`}
    >
      <div 
        className={`h-full rounded-xl p-6 flex flex-col ${
          popular ? 'bg-card border-2 border-success/20' : 'bg-card border border-border'
        }`}
      >
        {popular && (
          <div className="py-1 px-3 bg-success text-white text-xs font-semibold rounded-full self-start mb-4">
            Most Popular
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-foreground/70 mb-6">{description}</p>
        
        <div className="mb-6">
          <div className="text-3xl font-bold flex items-center">
            {isPoints && <Coins className="h-5 w-5 mr-2 text-yellow-500" />}
            {price}
          </div>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <Check className="h-5 w-5 text-success shrink-0 mr-3 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-foreground/30 shrink-0 mr-3 mt-0.5" />
              )}
              <span className={feature.included ? '' : 'text-foreground/50'}>{feature.title}</span>
            </li>
          ))}
        </ul>
        
        <Link 
          to={ctaLink} 
          className={`mt-auto py-3 px-6 rounded-lg text-center font-semibold transition-all ${
            popular 
              ? 'bg-success hover:bg-success/90 text-white' 
              : 'bg-secondary hover:bg-secondary/70 text-foreground'
          }`}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
};

export default PricingPlan;
