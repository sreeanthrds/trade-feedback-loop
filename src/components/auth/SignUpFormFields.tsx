
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpFormData } from '@/hooks/useSignUpForm';

interface SignUpFormFieldsProps {
  formData: SignUpFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignUpFormFields: React.FC<SignUpFormFieldsProps> = ({ formData, handleChange }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input 
            id="first_name"
            name="first_name"
            type="text"
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input 
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input 
          id="phone_number"
          name="phone_number"
          type="tel"
          placeholder="1234567890"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email_id">Email</Label>
        <Input 
          id="email_id"
          name="email_id"
          type="email"
          placeholder="your@email.com"
          value={formData.email_id}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username"
          name="username"
          type="text"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>
    </>
  );
};

export default SignUpFormFields;
