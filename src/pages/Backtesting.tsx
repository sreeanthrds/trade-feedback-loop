
import React, { useState } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import BacktestConfigPanel from '@/components/strategy/backtesting/BacktestConfigPanel';
import { useBacktestingStore } from '@/components/strategy/backtesting/useBacktestingStore';

const BacktestingPage = () => {
  const { startBacktest, isRunning, results } = useBacktestingStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6 pt-4">
            <h1 className="text-3xl font-bold mb-2">Backtesting</h1>
            <p className="text-foreground/70">
              Configure and run backtests for your trading strategies
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="border border-border rounded-xl p-4">
              <BacktestConfigPanel />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BacktestingPage;
