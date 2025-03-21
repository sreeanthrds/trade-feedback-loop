
import React, { useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import Pricing from '@/components/home/pricing';

const PricingPage = () => {
  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28">
        <section className="container mx-auto px-4 md:px-6 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-down">
            Simple Pricing for Every Trader
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto animate-slide-up">
            Choose the plan that fits your trading needs. All plans come with a 14-day trial.
          </p>
        </section>
        
        <Pricing />
        
        {/* FAQ Section */}
        <section className="container mx-auto px-4 md:px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-secondary/20 rounded-xl p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-foreground/70">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-secondary/20 rounded-xl p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-foreground/70">
                Absolutely! All paid plans include a 14-day free trial, so you can test all features before committing.
              </p>
            </div>
            
            <div className="bg-secondary/20 rounded-xl p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-foreground/70">
                We accept all major credit cards, PayPal, and selected cryptocurrencies for payment.
              </p>
            </div>
            
            <div className="bg-secondary/20 rounded-xl p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-3">Can I upgrade or downgrade my plan?</h3>
              <p className="text-foreground/70">
                Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies to your next billing cycle.
              </p>
            </div>
            
            <div className="bg-secondary/20 rounded-xl p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-3">Is my data secure?</h3>
              <p className="text-foreground/70">
                We take security seriously. All data is encrypted both in transit and at rest, and we never share your information with third parties.
              </p>
            </div>
            
            <div className="bg-secondary/20 rounded-xl p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-3">Do you offer refunds?</h3>
              <p className="text-foreground/70">
                We offer a 30-day money-back guarantee if you're not satisfied with our service. Just contact our support team within 30 days of your purchase.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
