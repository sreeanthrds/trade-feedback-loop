
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
  const [apiResponse, setApiResponse] = useState<any>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    setApiResponse(null);
    
    try {
      // First attempt to register with Supabase
      console.log('Attempting Supabase registration for:', formData.email_id);
      const supabaseResult = await signUp(formData.email_id, formData.password);
      
      if (supabaseResult.success) {
        console.log('Supabase registration successful. Now registering with API.');
        
        // If Supabase registration is successful, also register with the API
        try {
          const { confirmPassword, ...requestBody } = formData;
          const response = await authService.register(requestBody);
          console.log("API registration response:", response);
          setApiResponse(response);
          
          if (response.success) {
            toast({
              title: "Account created",
              description: "Your account has been created successfully"
            });
            
            setTimeout(() => {
              navigate('/app', { replace: true });
            }, 2000);
          } else {
            setError(response.message || "API registration failed with an unknown error");
          }
        } catch (apiError: any) {
          console.error("API registration error:", apiError);
          setApiResponse({ error: apiError.message || "Failed to connect to registration API" });
          setError(apiError.message || "Registration with API failed. However, your Supabase account was created.");
          
          // Even if API fails, we can still navigate since Supabase registration was successful
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 2000);
        }
      } else {
        // If Supabase registration fails, show the error
        console.error('Supabase registration failed:', supabaseResult.error);
        setError(supabaseResult.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setApiResponse({ error: err.message || "Unknown error occurred" });
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    apiResponse,
    handleChange,
    handleSubmit,
    setError
  };
};
