
import { SignUpFormData } from '@/hooks/useSignUpForm';

interface RegistrationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const authService = {
  async register(userData: Omit<SignUpFormData, 'confirmPassword'>): Promise<RegistrationResponse> {
    try {
      const response = await fetch('http://34.47.197.96:2232/user/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': 'trady'
        },
        mode: 'cors',
        body: JSON.stringify(userData)
      });
      
      // Get the raw response text
      const rawResponseText = await response.text();
      console.log('Raw API response:', rawResponseText);
      
      // Try to parse as JSON
      let parsedResponse;
      try {
        parsedResponse = rawResponseText ? JSON.parse(rawResponseText) : {};
      } catch (e) {
        console.error('Failed to parse API response as JSON:', e);
        return {
          success: false,
          message: `Server returned non-JSON response: ${rawResponseText.substring(0, 100)}${rawResponseText.length > 100 ? '...' : ''}`,
          data: { rawResponse: rawResponseText }
        };
      }
      
      if (!response.ok) {
        return {
          success: false,
          message: parsedResponse.message || `Registration failed with status ${response.status}`,
          data: parsedResponse
        };
      }
      
      return {
        success: true,
        message: parsedResponse.message || 'Registration successful',
        data: parsedResponse
      };
    } catch (error: any) {
      console.error('Registration API error:', error);
      return {
        success: false,
        message: error.message || 'Network error during registration',
        data: { error }
      };
    }
  },
  
  createMockUser(userData: SignUpFormData): void {
    localStorage.setItem('mock_current_user', JSON.stringify({
      id: `mock-user-${Date.now()}`,
      email: userData.email_id,
      name: `${userData.first_name} ${userData.last_name}`
    }));
  }
};
