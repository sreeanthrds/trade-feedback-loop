import React, { useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MousePointer, 
  Database, 
  BarChart, 
  Sliders, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface FeatureCardProps { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <div className="flex flex-col p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 h-full">
    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-foreground/70 mt-auto">{description}</p>
  </div>
);

const FeaturePoint = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3 mb-4">
    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
    <p className="text-foreground/80">{children}</p>
  </div>
);

const FeatureSection = ({ 
  title, 
  description, 
  image, 
  points,
  reversed = false 
}: { 
  title: string; 
  description: string; 
  image: React.ReactNode;
  points: string[];
  reversed?: boolean;
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 md:py-24`}>
      <div className={`${reversed ? 'lg:order-2' : ''} animate-fade-in`}>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
        <p className="text-lg text-foreground/70 mb-6">{description}</p>
        
        <div className="mb-8">
          {points.map((point, index) => (
            <FeaturePoint key={index}>{point}</FeaturePoint>
          ))}
        </div>
        
        <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center group transition-all">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className={`${reversed ? 'lg:order-1' : ''}`}>
        {image}
      </div>
    </div>
  );
};

const Features = () => {
  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, []);

  const coreFeatures = [
    {
      icon: <MousePointer className="h-6 w-6 text-primary" />,
      title: "Intuitive Interface",
      description: "Navigate our platform with ease - designed for both novice and expert traders."
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Premium Data Access",
      description: "Access high-quality, real-time market data from Indian exchanges."
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: "Advanced Analytics",
      description: "Comprehensive metrics and visual analytics to evaluate your trading performance."
    },
    {
      icon: <Sliders className="h-6 w-6 text-primary" />,
      title: "Customizable Strategies",
      description: "Build and adjust your trading strategies to match your risk profile."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 animate-fade-in">
              Powerful Features for Indian Traders
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8 animate-fade-in">
              Discover the tools that give you an edge in the market
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {coreFeatures.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Carousel */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mx-4">
                    <p className="text-lg mb-6 italic text-foreground/80">
                      "Trady has completely transformed my approach to the market. The no-code strategy builder saved me countless hours."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold">MK</span>
                      </div>
                      <div>
                        <div className="font-medium">Michael K.</div>
                        <div className="text-sm text-foreground/70">Day Trader</div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mx-4">
                    <p className="text-lg mb-6 italic text-foreground/80">
                      "The detailed analytics helped me identify weaknesses in my approach. My win rate has improved by 15% since using the platform."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold">SJ</span>
                      </div>
                      <div>
                        <div className="font-medium">Sarah J.</div>
                        <div className="text-sm text-foreground/70">Swing Trader</div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mx-4">
                    <p className="text-lg mb-6 italic text-foreground/80">
                      "As someone intimidated by coding, this platform has been a game-changer. The visual interface makes strategy testing so accessible."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold">RL</span>
                      </div>
                      <div>
                        <div className="font-medium">Robert L.</div>
                        <div className="text-sm text-foreground/70">Crypto Investor</div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2 lg:-left-12" />
              <CarouselNext className="right-2 lg:-right-12" />
            </Carousel>
          </div>
        </section>
        
        {/* Feature Sections */}
        <section className="container mx-auto px-4 md:px-6">
          {/* Strategy Builder */}
          <FeatureSection
            title="Visual Strategy Builder"
            description="Create complex trading strategies with our no-code, node-based visual editor, designed specifically for Indian markets."
            image={
              <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="Strategy Builder Interface" 
                  className="w-full h-auto object-cover"
                />
              </div>
            }
            points={[
              "Drag-and-drop nodes to create your strategy logic",
              "Pre-built indicators and conditions for Indian markets",
              "Backtest your strategy against historical data",
              "No programming knowledge required"
            ]}
          />
          
          {/* Market Data */}
          <FeatureSection
            title="Comprehensive Market Data"
            description="Access clean, reliable data from all major Indian exchanges to power your strategy testing."
            image={
              <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475" 
                  alt="Market Data Visualization" 
                  className="w-full h-auto object-cover"
                />
              </div>
            }
            points={[
              "NSE, BSE, and MCX data coverage",
              "Tick-by-tick historical data",
              "Corporate actions adjusted",
              "Seamless data integration with strategy builder"
            ]}
            reversed
          />
          
          {/* Performance Analytics */}
          <FeatureSection
            title="Advanced Performance Metrics"
            description="Analyze every aspect of your trading strategy with detailed metrics and visualizations."
            image={
              <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
                  alt="Performance Analytics Dashboard" 
                  className="w-full h-auto object-cover"
                />
              </div>
            }
            points={[
              "Profit and loss analysis",
              "Drawdown and volatility metrics",
              "Risk-adjusted return calculations",
              "Trade distribution visualizations"
            ]}
          />
          
          {/* Community Features */}
          <FeatureSection
            title="Trader Community"
            description="Connect with fellow traders, share strategies, and learn from the community."
            image={
              <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                  alt="Trader Community Interface" 
                  className="w-full h-auto object-cover"
                />
              </div>
            }
            points={[
              "Share and discover trading strategies",
              "Discuss market insights with other traders",
              "Follow top performers",
              "Collaborate on strategy development"
            ]}
            reversed
          />
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8 animate-fade-in">
              Join thousands of Indian traders who have discovered their edge using our platform.
            </p>
            <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center animate-fade-in">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
