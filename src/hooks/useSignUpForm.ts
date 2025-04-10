
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

// Define possible error types from Supabase
interface ErrorWithMessage {
  message: string;
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
    setApiResponse(null);
    
    try {
      const { confirmPassword, ...requestBody } = formData;
      
      // Skip Supabase attempt and go directly to API for debugging
      console.log("Attempting API registration call with credentials:", JSON.stringify(requestBody));
      
      try {
        const response = await authService.register(requestBody);
        console.log("API registration response:", response);
        setApiResponse(response);
        
        toast({
          title: "Registration Attempt",
          description: "See console for full API response details"
        });
        
        if (response.success) {
          toast({
            title: "Account created",
            description: "Your account has been created successfully"
          });
          
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 2000);
        } else {
          setError(response.message || "Registration failed with an unknown error");
        }
      } catch (apiError: any) {
        console.error("API registration error:", apiError);
        setApiResponse({ error: apiError.message || "Failed to connect to registration API" });
        setError(apiError.message || "Registration failed. Please try again.");
        
        // Fall back to mock user in development
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: creating mock user as fallback");
          authService.createMockUser(formData);
          
          toast({
            title: "Development Mode",
            description: "Created mock user account since API connection failed"
          });
          
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 2000);
        }
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
