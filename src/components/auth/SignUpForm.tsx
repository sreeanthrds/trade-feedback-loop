
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import SignUpFormFields from './SignUpFormFields';
import SocialLoginButtons from './SocialLoginButtons';

const SignUpForm = () => {
  const { 
    formData, 
    isSubmitting, 
    error, 
    handleChange, 
    handleSubmit, 
    setError 
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <SignUpFormFields formData={formData} handleChange={handleChange} />
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
        </div>
      </div>
      
      <SocialLoginButtons onError={setError} />
    </form>
  );
};

export default SignUpForm;
