
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';

interface PlanFeature {
  title: string;
  included: boolean;
}

interface PricingPlanProps {
  title: string;
  price: string;
  yearlyPrice?: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

const PricingPlan = ({ 
  title, 
  price, 
  yearlyPrice,
  description, 
  features, 
  ctaText, 
  ctaLink, 
  popular = false 
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
          <div className="text-3xl font-bold">{price}</div>
          {yearlyPrice && (
            <div className="text-foreground/70 text-sm">{yearlyPrice}</div>
          )}
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

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  const plans = [
    {
      title: "Free Tier",
      price: "$0",
      description: "Perfect for beginners exploring strategy testing.",
      features: [
        { title: "Basic backtesting tools", included: true },
        { title: "Limited historical data (1 year)", included: true },
        { title: "5 tests per day", included: true },
        { title: "Basic performance metrics", included: true },
        { title: "Community support", included: true },
        { title: "Advanced analytics", included: false },
        { title: "Unlimited tests", included: false },
        { title: "Priority support", included: false },
      ],
      ctaText: "Start Free",
      ctaLink: "/signup",
      popular: false,
    },
    {
      title: "Pro Tier",
      price: isAnnual ? "$29/month" : "$35/month",
      yearlyPrice: isAnnual ? "billed annually ($290/year)" : null,
      description: "For serious traders seeking an edge.",
      features: [
        { title: "All Free features", included: true },
        { title: "Unlimited backtesting", included: true },
        { title: "Full historical data access", included: true },
        { title: "Advanced analytics dashboard", included: true },
        { title: "Technical indicator library", included: true },
        { title: "Strategy optimization tools", included: true },
        { title: "Email support", included: true },
        { title: "API access", included: false },
      ],
      ctaText: "Go Pro",
      ctaLink: "/signup?plan=pro",
      popular: true,
    },
    {
      title: "Elite Tier",
      price: isAnnual ? "$79/month" : "$99/month",
      yearlyPrice: isAnnual ? "billed annually ($790/year)" : null,
      description: "For professionals and institutions.",
      features: [
        { title: "All Pro features", included: true },
        { title: "Custom data imports", included: true },
        { title: "API access", included: true },
        { title: "White-label reports", included: true },
        { title: "Custom indicator development", included: true },
        { title: "Multi-user accounts", included: true },
        { title: "Priority support", included: true },
        { title: "Strategy consulting session", included: true },
      ],
      ctaText: "Get Elite",
      ctaLink: "/signup?plan=elite",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple Pricing for Every Trader
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your trading style. All plans include a 14-day trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-6">
            <span className={`mr-3 ${!isAnnual ? 'text-foreground' : 'text-foreground/70'}`}>
              Monthly
            </span>
            <button 
              onClick={toggleBilling}
              className="relative w-14 h-7 bg-secondary rounded-full p-1 transition-colors"
            >
              <span 
                className={`absolute top-1 w-5 h-5 rounded-full bg-success transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-foreground' : 'text-foreground/70'}`}>
              Annually
            </span>
            <span className="ml-2 text-xs font-medium text-success bg-success/10 py-1 px-2 rounded-full">
              Save 15%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <PricingPlan {...plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
