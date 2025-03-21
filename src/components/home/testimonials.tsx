
import React from 'react';
import { Award, Users } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ quote, author, role }: TestimonialProps) => (
  <div className="p-6 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-border relative animate-slide-up">
    <div className="absolute -top-3 -left-3 text-success text-4xl opacity-30">"</div>
    <blockquote className="text-foreground/90 mb-4">
      {quote}
    </blockquote>
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mr-3">
        <span className="text-sm font-semibold">{author.charAt(0)}</span>
      </div>
      <div>
        <div className="font-medium">{author}</div>
        <div className="text-sm text-foreground/70">{role}</div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote: "TradeBack Pro saved me hours of manual testing and helped me find the edge I was missing in my strategies.",
      author: "Michael K.",
      role: "Day Trader"
    },
    {
      quote: "The detailed analytics helped me identify the weaknesses in my approach. My win rate has improved by 15% since using the platform.",
      author: "Sarah J.",
      role: "Swing Trader"
    },
    {
      quote: "As someone who was intimidated by coding, this platform has been a game-changer. The visual interface makes testing so accessible.",
      author: "Robert L.",
      role: "Crypto Investor"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0 animate-slide-up">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-success mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold">Trusted by Traders</h2>
            </div>
            <p className="text-lg text-foreground/70 max-w-lg">
              Join thousands of traders who have found their edge using our platform.
            </p>
          </div>
          
          <div className="flex items-center bg-success/10 backdrop-blur-sm px-6 py-4 rounded-full border border-success/30 animate-pulse-subtle">
            <Users className="h-5 w-5 text-success mr-3" />
            <span className="text-lg font-medium">10,000+ active traders</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              quote={testimonial.quote} 
              author={testimonial.author} 
              role={testimonial.role} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
