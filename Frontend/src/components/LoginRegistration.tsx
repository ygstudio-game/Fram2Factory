import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Factory, Mail, Lock, Shield, CheckCircle, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useApi';
import type { User as UserType, UserRole } from '../types';
import { log } from 'node:console';

interface LoginRegistrationProps {
  onLogin: (user: UserType) => void;
}

export function LoginRegistration({ onLogin }: LoginRegistrationProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    location: '',
    phone: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    setError(null);

    try {
      let userObj = null;
      let response;
      if (mode === 'login') {
        response = await login(formData.email, formData.password, selectedRole);
      } else {
        const userData: any = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          location: formData.location,
          phone: formData.phone,
          company: selectedRole === 'factory' ? formData.company : undefined
        };
        response = await register(userData);
      }
      console.log(response);
      
      if (response && response.success && response.data) {
        userObj = response.data.user || response.data;
        if (userObj) {
          onLogin(userObj);
        } else {
          setError(mode === 'login' ? 'Invalid credentials. Please try again.' : 'Registration failed. Please try again.');
        }
      } else {
        setError(mode === 'login' ? '2Invalid credentials. Please try again.' : 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role: 'farmer' | 'factory') => {
    if (role === 'factory') {
      setFormData({
        email: 'dhananjaychavan945@gmail.com',
        password: 'demo123',
        name: 'Dhananjay Chavan',
        location: 'Chakan, pune',
        phone: '+91 9022728021',
        company: 'Dhananjay Factory Pvt. Ltd.'
      });
    } else {
      setFormData({
        email: 'yadnyeshsunilborole@gmail.com',
        password: 'demo123',
        name: 'Yadnyesh Borole',  
        location: 'Bhusawal, Maharashtra',
        phone: '+91 8999617312',
        company: 'Yadnyesh Farms Pvt. Ltd.'
      });
    }
    setSelectedRole(role);
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-600">
                  <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7M3 7L12 2L21 7M3 7V8M21 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
            <CardTitle className="text-2xl">Farm2Factory</CardTitle>
            <p className="text-gray-600">Choose your account type to continue</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Role Selection */}
            {!selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Label>I am a:</Label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole('farmer')}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 group"
                  >
                    <User className="w-8 h-8 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
                    <p className="font-medium">Farmer</p>
                    <p className="text-sm text-gray-500">Sell your crops</p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole('factory')}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <Factory className="w-8 h-8 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
                    <p className="font-medium">Factory</p>
                    <p className="text-sm text-gray-500">Source materials</p>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Login/Register Form */}
            {selectedRole && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center gap-2">
                    {selectedRole === 'farmer' ? (
                      <User className="w-4 h-4 text-green-600" />
                    ) : (
                      <Factory className="w-4 h-4 text-blue-600" />
                    )}
                    {selectedRole === 'farmer' ? 'Farmer Account' : 'Factory Account'}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                  >
                    Change
                  </Button>
                </div>

                {mode === 'register' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {selectedRole === 'farmer' ? 'Your Name' : 'Company Name'}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={selectedRole === 'farmer' ? 'Enter your name' : 'Enter company name'}
                        className="bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Enter your location"
                          className="pl-10 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="pl-10 bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                {/* Demo Credentials */}
                {mode === 'login' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 text-center">Try demo accounts:</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemoCredentials('farmer')}
                        className="flex-1 text-xs"
                      >
                        Demo Farmer
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemoCredentials('factory')}
                        className="flex-1 text-xs"
                      >
                        Demo Factory
                      </Button>
                    </div>
                  </div>
                )}

                {/* Security Indicators */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>KYC Verified</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl shadow-lg transition-all duration-200 ${
                    selectedRole === 'farmer'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } text-white`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {mode === 'login' 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </Button>
                </div>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}