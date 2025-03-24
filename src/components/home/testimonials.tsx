
import React from 'react';
import { Award, Users } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ quote, author, role }: TestimonialProps) => (
  <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 h-full flex flex-col">
    <div className="flex mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
        </svg>
      ))}
    </div>
    <blockquote className="text-foreground/90 mb-6 flex-grow">
      "{quote}"
    </blockquote>
    <div className="flex items-center mt-auto">
      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
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
      quote: "Trady saved me hours of manual testing and helped me find the edge I was missing in my strategies.",
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
    },
    {
      quote: "The Indian market data coverage is exceptional. I can now backtest with confidence knowing the data is reliable.",
      author: "Priya M.",
      role: "Options Trader"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0 animate-fade-in">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold">Trusted by Traders</h2>
            </div>
            <p className="text-lg text-foreground/70 max-w-lg">
              Join thousands of traders who have found their edge using our platform.
            </p>
          </div>
          
          <div className="flex items-center bg-primary/10 px-6 py-4 rounded-full border border-primary/30 animate-pulse-subtle">
            <Users className="h-5 w-5 text-primary mr-3" />
            <span className="text-lg font-medium">10,000+ active traders</span>
          </div>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                <TestimonialCard 
                  quote={testimonial.quote} 
                  author={testimonial.author} 
                  role={testimonial.role} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 lg:-left-12" />
          <CarouselNext className="right-2 lg:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
