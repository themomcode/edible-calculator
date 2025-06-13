import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

const AgeVerificationDialog = ({ onVerified }) => {
  const [isUnderage, setIsUnderage] = useState(false);

  const handleConfirm = () => {
    onVerified();
  };

  const handleDeny = () => {
    setIsUnderage(true);
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="bg-card border-primary/20">
        {!isUnderage ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-2xl">
                <Leaf className="h-6 w-6 text-primary" />
                Age Verification
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This website contains content related to cannabis. Please confirm you are 21 years of age or older to enter.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="destructive"
                onClick={handleDeny}
              >
                I am not 21
              </Button>
              <AlertDialogAction
                onClick={handleConfirm}
                className="herb-gradient"
              >
                I am 21 or older
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-2xl text-destructive">
                <Leaf className="h-6 w-6" />
                Access Denied
              </AlertDialogTitle>
              <AlertDialogDescription>
                You must be 21 years of age or older to access this content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <p className="text-sm text-muted-foreground text-center w-full">Please exit this page.</p>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgeVerificationDialog;