
import { SignUpFormData } from '@/hooks/useSignUpForm';

interface RegistrationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const authService = {
  async register(userData: Omit<SignUpFormData, 'confirmPassword'>): Promise<RegistrationResponse> {
    const response = await fetch('http://34.47.197.96:2232/user/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': 'trady'
      },
      mode: 'cors',
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await response.json();
  },
  
  createMockUser(userData: SignUpFormData): void {
    localStorage.setItem('mock_current_user', JSON.stringify({
      id: `mock-user-${Date.now()}`,
      email: userData.email_id,
      name: `${userData.first_name} ${userData.last_name}`
    }));
  }
};
