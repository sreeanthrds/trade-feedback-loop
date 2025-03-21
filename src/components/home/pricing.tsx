
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, AlertCircle, Coins } from 'lucide-react';

interface PlanFeature {
  title: string;
  included: boolean;
}

interface PricingPlanProps {
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

const Pricing = () => {
  const freePlan = {
    title: "Free Trial",
    price: "₹0",
    description: "Perfect for exploring trading simulation.",
    features: [
      { title: "1-day trading simulator access", included: true },
      { title: "Limited historical data (1 month)", included: true },
      { title: "Basic performance metrics", included: true },
      { title: "Community support", included: true },
      { title: "Advanced analytics", included: false },
      { title: "Extended backtesting", included: false },
      { title: "Priority support", included: false },
    ],
    ctaText: "Start Free",
    ctaLink: "/signup",
    popular: false,
  };

  const pointsPlans = [
    {
      title: "Starter Pack",
      price: "500 Points - ₹999",
      description: "For casual traders just getting started.",
      features: [
        { title: "5 backtesting sessions", included: true },
        { title: "3 months historical data", included: true },
        { title: "Basic technical indicators", included: true },
        { title: "Equity curve analysis", included: true },
        { title: "Export reports (PDF)", included: true },
        { title: "Advanced strategy tools", included: false },
        { title: "Priority support", included: false },
      ],
      ctaText: "Buy Points",
      ctaLink: "/signup?plan=starter",
      popular: false,
      isPoints: true,
    },
    {
      title: "Pro Trader",
      price: "1500 Points - ₹2499",
      description: "For serious traders seeking an edge.",
      features: [
        { title: "20 backtesting sessions", included: true },
        { title: "Full 3 months historical data", included: true },
        { title: "Advanced technical indicators", included: true },
        { title: "Strategy optimization tools", included: true },
        { title: "Export reports (all formats)", included: true },
        { title: "Email support", included: true },
        { title: "Multi-timeframe analysis", included: true },
      ],
      ctaText: "Get Pro Pack",
      ctaLink: "/signup?plan=pro",
      popular: true,
      isPoints: true,
    },
    {
      title: "Institutional",
      price: "5000 Points - ₹7999",
      description: "For professionals and institutions.",
      features: [
        { title: "Unlimited backtesting sessions", included: true },
        { title: "Full historical data access", included: true },
        { title: "Custom indicator development", included: true },
        { title: "Multi-user accounts", included: true },
        { title: "Priority support", included: true },
        { title: "Strategy consulting session", included: true },
        { title: "API access", included: true },
      ],
      ctaText: "Get Institutional",
      ctaLink: "/signup?plan=institutional",
      popular: false,
      isPoints: true,
    },
  ];

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
      </div>
    </section>
  );
};

export default Pricing;
