
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BarChart, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StrategyCardProps {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  created: string;
  returns?: number;
}

const StrategyCard = ({ id, name, description, lastModified, created, returns }: StrategyCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Modified: {lastModified}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Created: {created}</span>
          </div>
          {returns !== undefined && (
            <div className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              <span className={returns >= 0 ? "text-green-600" : "text-red-600"}>
                Returns: {returns > 0 ? "+" : ""}{returns.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/app/strategy-builder/${id}`}>Edit</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/app/backtesting/${id}`}>Test</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StrategyCard;
