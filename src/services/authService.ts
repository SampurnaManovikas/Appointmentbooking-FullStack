import { apiClient } from './apiService';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response;
  } catch (error: any) {
    // Return the error response instead of throwing
    return {
      success: false,
      message: error.message || 'Registration failed'
    };
  }
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse & { requiresVerification?: boolean; email?: string }> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // Store token in localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  } catch (error: any) {
    // Parse the error response to check for verification requirements
    const errorData = error.data || {};
    return {
      success: false,
      message: error.message || 'Login failed',
      requiresVerification: errorData.requiresVerification || false,
      email: errorData.email || data.email
    };
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (data: OTPData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', data);
    
    // Store token in localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/resend-otp', { email });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout', {});
  } catch (error) {
    // Continue with logout even if server request fails
    console.error('Logout request failed:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user data');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return Boolean(token && user);
};

/**
 * Get stored user data
 */
export const getStoredUser = (): User | null => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
};

/**
 * Get stored token
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<{ data: { user: User } }> => {
  try {
    const response = await apiClient.get<{ data: { user: User } }>('/auth/profile');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: { fullName: string; phoneNumber: string }): Promise<{ data: { user: User } }> => {
  try {
    const response = await apiClient.put<{ data: { user: User } }>('/auth/profile', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; email?: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; email?: string }>('/auth/forgot-password', { email });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to request password reset');
  }
};

/**
 * Verify password reset OTP
 */
export const verifyPasswordResetOTP = async (data: OTPData): Promise<{ success: boolean; message: string; email?: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; email?: string }>('/auth/verify-password-reset-otp', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify password reset OTP');
  }
};

/**
 * Reset password
 */
export const resetPassword = async (data: { email: string; otp: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};
