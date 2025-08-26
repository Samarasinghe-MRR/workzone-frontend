'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/services/apiService';
import { 
  useUpdateProfile, 
  useCustomerProfile, 
  usePasswordReset 
} from '@/features/auth/hooks/useSettingsData';
import { z } from 'zod';

// Schema definitions
const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const customerProfileSchema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type CustomerProfileFormData = z.infer<typeof customerProfileSchema>;

interface ProfileFormProps {
  user: UserProfile | null;
  onProfileUpdate?: () => void;
}

// Personal Information Form (updates user basic info)
export function PersonalInfoForm({ user, onProfileUpdate }: ProfileFormProps) {
  const { updateProfile, isUpdating } = useUpdateProfile();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      await updateProfile(data);
      onProfileUpdate?.();
      reset(data);
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your basic profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your full name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter your phone number"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isUpdating} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Customer Profile Form (creates customer-specific profile)
export function CustomerProfileForm({ user, onProfileUpdate }: ProfileFormProps) {
  const { createCustomerProfile, isCreating } = useCustomerProfile();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerProfileFormData>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      address: user?.customerProfile?.address || '',
    },
  });

  const onSubmit = async (data: CustomerProfileFormData) => {
    try {
      await createCustomerProfile(data);
      onProfileUpdate?.();
      reset(data);
    } catch {
      // Error handling is done in the hook
    }
  };

  // Don't show this form if user already has a customer profile
  if (user?.customerProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Profile</CardTitle>
          <CardDescription>Your customer profile is already set up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Address:</strong> {user.customerProfile.address}</p>
            {user.customerProfile.latitude && user.customerProfile.longitude && (
              <p><strong>Location:</strong> {user.customerProfile.latitude}, {user.customerProfile.longitude}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Profile</CardTitle>
        <CardDescription>
          Create your customer profile to access services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Enter your complete address"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isCreating} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {isCreating ? 'Creating...' : 'Create Customer Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Legacy forms for backward compatibility
export function ProfileForm({ profile, onSuccess }: { profile: UserProfile; onSuccess: () => void }) {
  return <PersonalInfoForm user={profile} onProfileUpdate={onSuccess} />;
}

export function PasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const { forgotPassword, isProcessing } = usePasswordReset();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().email() })),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await forgotPassword(data.email);
      reset();
      onSuccess();
    } catch {
      // Error handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email for Password Reset</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isProcessing} className="bg-emerald-600 hover:bg-emerald-700">
        {isProcessing ? 'Sending...' : 'Send Reset Email'}
      </Button>
    </form>
  );
}
