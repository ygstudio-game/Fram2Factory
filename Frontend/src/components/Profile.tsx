import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Shield, 
  Settings, 
  Bell, 
  LogOut,
  Edit3,
  Star,
  Award,
  Truck,
  Package
} from 'lucide-react';
import type { User as UserType, Screen } from '../types';

interface ProfileProps {
  user: UserType | null;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function Profile({ user, onNavigate, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
     phone: user?.phone || '',
    description: user?.bio || '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    qualityAlerts: true
  });

  // const stats = user?.role === 'farmer' ? [
  //   { label: 'Total Contracts', value: '47', icon: FileText },
  //   { label: 'Rating', value: '4.8', icon: Star },
  //   { label: 'Successful Deliveries', value: '45', icon: Truck },
  //   { label: 'Total Revenue', value: '₹2.1Cr', icon: Award }
  // ] : [
  //   { label: 'Active Contracts', value: '12', icon: FileText },
  //   { label: 'Rating', value: '4.7', icon: Star },
  //   { label: 'Orders Completed', value: '89', icon: Package },
  //   { label: 'Total Procurement', value: '₹5.3Cr', icon: Award }
  // ];
const stats = user?.role === 'farmer' ? [
  { label: 'Total Contracts', value: user?.totalContracts, icon: FileText },
  { label: 'Rating', value: user?.rating, icon: Star },
  { label: 'Successful Deliveries', value: user?.successfulDeliveries || 0, icon: Truck },
  { label: 'Total Revenue', value: `₹${user?.totalRevenue?.toLocaleString() || 0}`, icon: Award }
] : [
  { label: 'Active Contracts', value: user?.totalContracts, icon: FileText },
  { label: 'Rating', value: user?.rating, icon: Star },
  { label: 'Orders Completed', value: user?.ordersCompleted || 0, icon: Package },
  { label: 'Total Procurement', value: "₹"+`${user?.totalProcurement?.toLocaleString() || 0}`, icon: Award }
];

  const certifications = user?.role === 'farmer' 
    ? ['Organic Certification', 'ISO 22000', 'Fair Trade Certified']
    : ['ISO 9001:2015', 'HACCP Certified', 'FSSAI Licensed'];

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
    console.log('Saving profile data:', profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Profile</h1>
            <p className="text-sm text-gray-600">Manage your account and preferences</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl mb-1">{user?.name}</h2>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user?.location}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user?.role === 'farmer' ? 'Verified Farmer' : 'Verified Factory'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-semibold mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={profileData.description}
                      onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{profileData.location}</span>
                  </div>
                  <Separator />
                  <p className="text-gray-600">{profileData.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">{cert}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get instant alerts on your device</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-600">Receive promotional content</p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, marketingEmails: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Quality Alerts</p>
                  <p className="text-sm text-gray-600">Quality and compliance notifications</p>
                </div>
                <Switch
                  checked={settings.qualityAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, qualityAlerts: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}