import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { Button, Input } from '@components/common';
import { useAuth } from '@hooks/useAuth';
import { Route } from '@utils/constants';

interface LoginPageProps {
  onNavigate: (page: Route) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = login({ email, password });
    if (result.success) {
      onNavigate('dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Wrench className="text-blue-600 mx-auto mb-2" size={48} />
            <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          </div>
          <Input label="Email Address" type="email" placeholder="Enter your email" />
          <Button className="w-full mt-4">Send Reset Link</Button>
          <button
            onClick={() => setShowForgotPassword(false)}
            className="text-blue-600 text-sm hover:underline w-full text-center mt-4"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Wrench className="text-blue-600 mx-auto mb-2" size={48} />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@maintenance.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Admin: admin@maintenance.com / admin123</p>
          <p className="text-xs text-gray-600">Tech: tech@maintenance.com / tech123</p>
          <p className="text-xs text-gray-600">Staff: staff@maintenance.com / staff123</p>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-600 text-sm hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};