
import React from 'react';
import { Clock, Database, BarChart3, Sliders, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  link?: string;
}

const BenefitCard = ({ icon, title, description, delay, link }: BenefitProps) => {
  const content = (
    <div 
      className="p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 border border-border smooth-transition group h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center mb-6 group-hover:-translate-y-1 smooth-transition">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
};

const Benefits = () => {
  const benefits = [
    {
      icon: <Clock className="h-6 w-6 text-success" />,
      title: "One-Day Simulator",
      description: "Test your strategies with our realistic trading simulator for a full day experience.",
      delay: 100
    },
    {
      icon: <Database className="h-6 w-6 text-success" />,
      title: "Indian Market Data",
      description: "Access 3 months of historical data for NSE, BSE, and other Indian exchanges.",
      delay: 200
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-success" />,
      title: "Actionable Insights",
      description: "Analyze performance with detailed metrics tailored for Indian market conditions.",
      delay: 300
    },
    {
      icon: <Sliders className="h-6 w-6 text-success" />,
      title: "Points System",
      description: "Purchase points to extend your trading capabilities and access premium features.",
      delay: 400
    },
    {
      icon: <GitBranch className="h-6 w-6 text-success" />,
      title: "Strategy Builder",
      description: "Create complex trading strategies with our no-code, node-based visual editor.",
      delay: 500,
      link: "/strategy-builder"
    }
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Master Trading in Indian Markets
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our platform provides everything you need to refine and validate your trading strategies for Indian stocks, indices, and derivatives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="animate-slide-up h-full">
              <BenefitCard {...benefit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
