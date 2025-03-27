
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { UsageReference } from '../../utils/dependency-tracking/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RemoveIndicatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicatorDisplayName: string;
  usages: UsageReference[];
  onConfirm: () => void;
}

const RemoveIndicatorDialog: React.FC<RemoveIndicatorDialogProps> = ({
  open,
  onOpenChange,
  indicatorDisplayName,
  usages,
  onConfirm
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {indicatorDisplayName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This indicator is currently used in the following places:
            <ul className="mt-2 space-y-1 text-sm">
              {usages.map((usage, index) => (
                <li key={index} className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>{usage.nodeName} ({usage.context})</span>
                </li>
              ))}
            </ul>
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Deleting this indicator will break functionality in the nodes listed above.
              </AlertDescription>
            </Alert>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveIndicatorDialog;
