
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth-service';

export interface SignUpFormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email_id: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    email_id: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'email_id' && !prev.username ? { username: value } : {})
    }));
  };

  const validateForm = (): string | null => {
    if (formData.password !== formData.confirmPassword) {
      return "Passwords don't match";
    }
    
    const requiredFields = ['first_name', 'last_name', 'phone_number', 'email_id', 'username', 'password'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return `${field.replace('_', ' ')} is required`;
      }
    }
    
    return null;
  };

  const supabaseSignUp = async () => {
    const result = await signUp(formData.email_id, formData.password);
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...requestBody } = formData;
      
      try {
        const supabaseResult = await supabaseSignUp();
        if (supabaseResult.error) {
          const errorMessage = typeof supabaseResult.error === 'string' 
            ? supabaseResult.error 
            : supabaseResult.error.message || 'Unknown error';
            
          console.log("Supabase signup fallback failed, continuing with API attempt:", errorMessage);
        } else {
          toast({
            title: "Account created",
            description: "Your account has been created successfully"
          });
          
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 500);
          return;
        }
      } catch (supabaseError) {
        console.log("Supabase signup attempt failed, continuing with API:", supabaseError);
      }
      
      console.log("Attempting API registration call with credentials:", JSON.stringify(requestBody));
      const response = await authService.register(requestBody);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully"
      });
      
      setTimeout(() => {
        navigate('/app', { replace: true });
      }, 500);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: creating mock user as fallback");
        authService.createMockUser(formData);
        
        toast({
          title: "Development Mode",
          description: "Created mock user account since API connection failed"
        });
        
        setTimeout(() => {
          navigate('/app', { replace: true });
        }, 500);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    setError
  };
};
