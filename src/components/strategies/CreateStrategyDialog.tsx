
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateStrategyDialogProps {
  open: boolean;
  strategyName: string;
  onOpenChange: (open: boolean) => void;
  onStrategyNameChange: (name: string) => void;
  onSubmit: () => void;
}

const CreateStrategyDialog = ({ 
  open, 
  strategyName, 
  onOpenChange, 
  onStrategyNameChange,
  onSubmit 
}: CreateStrategyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Name Your Strategy</DialogTitle>
          <DialogDescription>
            Give your strategy a unique, descriptive name.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Strategy Name</Label>
              <Input
                id="name"
                value={strategyName}
                onChange={(e) => onStrategyNameChange(e.target.value)}
                placeholder="Enter strategy name"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Strategy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStrategyDialog;
