
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Calendar, Clock, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StrategyCardProps {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  created: string;
  returns?: number;
  onDelete: (id: string) => void;
}

const StrategyCard = ({ 
  id, 
  name, 
  description, 
  lastModified, 
  created, 
  returns,
  onDelete
}: StrategyCardProps) => {
  const { toast } = useToast();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete strategy "${name}"?`)) {
      onDelete(id);
      toast({
        title: "Strategy deleted",
        description: `"${name}" has been removed.`,
      });
    }
  };

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
          <Link to={`/app/strategy-builder?id=${id}&name=${encodeURIComponent(name)}`}>Edit</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/app/backtesting/${id}`}>Test</Link>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StrategyCard;
