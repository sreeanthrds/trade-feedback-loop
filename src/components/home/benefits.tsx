
import React from 'react';
import { Clock, Database, BarChart3, Sliders } from 'lucide-react';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const BenefitCard = ({ icon, title, description, delay }: BenefitProps) => (
  <div 
    className="p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 border border-border smooth-transition group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center mb-6 group-hover:-translate-y-1 smooth-transition">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-foreground/70">{description}</p>
  </div>
);

const Benefits = () => {
  const benefits = [
    {
      icon: <Clock className="h-6 w-6 text-success" />,
      title: "Fast & Simple",
      description: "Run backtests in minutes with our intuitive interface. No coding required.",
      delay: 100
    },
    {
      icon: <Database className="h-6 w-6 text-success" />,
      title: "Real Data",
      description: "Access years of historical data across stocks, forex, and crypto markets.",
      delay: 200
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-success" />,
      title: "Actionable Insights",
      description: "Analyze performance with detailed metrics and visualization tools.",
      delay: 300
    },
    {
      icon: <Sliders className="h-6 w-6 text-success" />,
      title: "Custom Parameters",
      description: "Fine-tune your strategies with adjustable variables and conditions.",
      delay: 400
    }
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Master Your Trading Edge
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our platform provides everything you need to refine and validate your trading strategies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="animate-slide-up">
              <BenefitCard {...benefit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
