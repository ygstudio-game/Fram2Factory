import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SearchAndFilter } from './SearchAndFilter';
import { 
  Plus, Star, MapPin, Clock, Package, Bell, User, Home, GitMerge, 
  FileText, CheckCircle, X, Edit, Trash2, Eye, TrendingUp, Calendar,
  Truck, DollarSign, AlertTriangle, MessageCircle
} from 'lucide-react';
import { useCrops, useNotifications, useMarketCrops ,useUser,useContact,useAuth} from '../hooks/useApi';
import { useAppContext } from '../context/AppContext';
import type { User as UserType, Screen, Crop, SearchFilters } from '../types';
import { log } from 'console';

interface FarmerDashboardProps {
  user: UserType | null;
  onNavigate: (screen: Screen) => void;
}

// Create a MotionDiv that forwards ref
const MotionDiv = motion(forwardRef(function MotionDiv(props, ref) {
  return <div ref={ref} {...props} />;
}));
let FarmerId ;
export function FarmerDashboard({ user, onNavigate }: FarmerDashboardProps) {
  FarmerId = user?.id;
  const { addNotification } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  // Crop form state
  const [cropForm, setCropForm] = useState({
    name: '',
    type: '',
    quantity: '',
    pricePerUnit: '',
    quality: '',
    harvestDate: '',
    expiryDate: '',
    description: '',
    organic: false
  });
  // State for editing crop
  const [editingCropId, setEditingCropId] = useState(null);
  // State for viewing crop
  const [viewingCrop, setViewingCrop] = useState(null);
  const cropFormRef = useRef(null);
  const [showCropForm, setShowCropForm] = useState(true);

  // Use custom hooks
  const { crops, loading, addCrop, updateCrop, refetch, clearAllCrops, deleteCrop } = useCrops(user?.id, filters);
  const { notifications } = useNotifications(user?.id);
  // Market crops from backend (all crops except current user)
  const { marketCrops, loading: marketLoading, refetch: refetchMarket } = useMarketCrops(user?.id);

  // Always show the crop form card
  // If editingCropId is set, form is in edit mode
  // Otherwise, form is in add mode

  const handleClearCropForm = () => {
    setEditingCropId(null);
    setCropForm({
      name: '',
      type: '',
      quantity: '',
      pricePerUnit: '',
      quality: '',
      harvestDate: '',
      expiryDate: '',
      description: '',
      organic: false
    });
    setShowCropForm(false);
  };

  const handleEditCrop = (crop) => {
    
    setEditingCropId(crop._id);
    setShowCropForm(true);
    setCropForm({
      name: crop.name,
      type: crop.type,
      quantity: crop.quantity.toString(),
      pricePerUnit: crop.price?.toString() ?? '',
      quality: crop.quality,
      harvestDate: crop.harvestDate,
      expiryDate: crop.expiryDate,
      description: crop.description,
      organic: crop.organic ?? false
    });
    // Scroll to crop form card
    if (cropFormRef.current) {
      cropFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddOrEditCrop = async () => {
    
    if (!user || !cropForm.name || !cropForm.type || !cropForm.quantity || !cropForm.pricePerUnit) {
      return;
    }
    const cropData = {
      name: cropForm.name,
      type: cropForm.type,
      quantity: Number(cropForm.quantity),
      unit: 'tons',
      price: Number(cropForm.pricePerUnit),
      harvestDate: cropForm.harvestDate ? new Date(cropForm.harvestDate).toISOString() : '',
      expiryDate: cropForm.expiryDate ? new Date(cropForm.expiryDate).toISOString() : '',
      quality: cropForm.quality,
      location: user.location,
      organic: cropForm.organic,
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
      ],
      description: cropForm.description,
      farmerId: user.id,
      status: 'available' as 'available'
    };
    const token = user?.token;
    let success = false;
    if (editingCropId) {
      success = await updateCrop(editingCropId, cropData,token);
    } else {
      success = await addCrop(cropData, token);
    }
    if (success) {
      handleClearCropForm();
      refetch();
      addNotification({
        id: Date.now().toString(),
        userId: user.id,
        type: 'system',
        title: editingCropId ? 'Crop Updated Successfully' : 'Crop Listed Successfully',
        message: editingCropId
          ? `Your ${cropForm.name} listing has been updated.`
          : `Your ${cropForm.name} listing has been added and is now visible to factories.`,
        read: false,
        createdAt: new Date().toISOString()
      });
      setEditingCropId(null);
    }
  };

  // View crop handler
  const handleViewCrop = (crop: Crop) => {
    setViewingCrop(crop);
  };
  const handleCloseViewCrop = () => {
    setViewingCrop(null);
  };

  // Mock inquiries data (would come from API)
  const [inquiries] = useState([
    {
      id: '1',
      factory: 'Suresh Foods Pvt Ltd',
      factoryId: '4',
      crop: 'Wheat',
      quantity: 200,
      maxPrice: 30000,
      location: 'Mumbai, Maharashtra',
      urgency: 'high',
      receivedTime: '2 hours ago',
      message: 'Looking for premium wheat for our flour production. Can you provide organic certified wheat?',
      deliveryDate: '2024-12-20'
    },
    {
      id: '2',
      factory: 'Green Valley Industries',
      factoryId: '5',
      crop: 'Rice',
      quantity: 150,
      maxPrice: 28000,
      location: 'Bangalore, Karnataka',
      urgency: 'medium',
      receivedTime: '5 hours ago',
      message: 'We need basmati rice for export. Quality should be premium grade.',
      deliveryDate: '2024-12-25'
    }
  ]);

  // Mock confirmed orders
  const [confirmedOrders] = useState([
    {
      id: '1',
      factory: 'Suresh Foods Pvt Ltd',
      crop: 'Rice',
      quantity: 100,
      amount: 4800000,
      status: 'in_progress',
      progress: 75,
      deliveryDate: '2024-12-10',
      paymentStatus: 'advance_paid'
    },
    {
      id: '2',
      factory: 'Green Valley Industries',
      crop: 'Wheat',
      quantity: 50,
      amount: 1400000,
      status: 'completed',
      progress: 100,
      deliveryDate: '2024-11-25',
      paymentStatus: 'completed'
    }
  ]);

  const handleInquiryResponse = async (inquiryId: string, action: 'accept' | 'reject') => {
    const inquiry = inquiries.find(i => i.id === inquiryId);
    if (!inquiry || !user) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const message = action === 'accept' 
      ? `Great! You've accepted the inquiry from ${inquiry.factory}. They will be notified and can proceed with the contract.`
      : `You've declined the inquiry from ${inquiry.factory}. The factory will be notified.`;

    addNotification({
      id: Date.now().toString(),
      userId: user.id,
      type: 'contract',
      title: action === 'accept' ? 'Inquiry Accepted' : 'Inquiry Declined',
      message,
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

const filteredCrops = crops.filter(crop =>
  (crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
   crop.type.toLowerCase().includes(searchQuery.toLowerCase())) 
   
);


  // Mock other farmers for market tab (replace with API in production)
  const [otherFarmers] = useState([
    {
      id: '2',
      name: 'Ramesh Singh',
      location: 'Punjab',
      crops: [
        { id: 'c1', name: 'Wheat', quantity: 300, price: 26000, unit: 'tons', quality: 'Premium', available: true },
        { id: 'c2', name: 'Rice', quantity: 200, price: 24000, unit: 'tons', quality: 'Standard', available: true }
      ]
    },
    {
      id: '3',
      name: 'Priya Patel',
      location: 'Gujarat',
      crops: [
        { id: 'c3', name: 'Fruits', quantity: 100, price: 35000, unit: 'tons', quality: 'Premium', available: true }
      ]
    }
  ]);

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-2xl mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-green-100 mb-4">Manage your crops and connect with factories</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{crops.length}</div>
              <div className="text-sm text-green-100">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{confirmedOrders.length}</div>
              <div className="text-sm text-green-100">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{inquiries.length}</div>
              <div className="text-sm text-green-100">New Inquiries</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleQuickAddCrop}
                className="h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex flex-col gap-1"
              >
                <Plus className="w-5 h-5" />
                Add Crop
              </Button>
              <Button
                onClick={() => onNavigate('matching')}
                variant="outline"
                className="h-16 flex flex-col gap-1 border-blue-200 hover:bg-blue-50"
              >
                <GitMerge className="w-5 h-5" />
                Find Matches
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('notifications')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Performing Crops */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Best Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {crops.slice(0, 2).map((crop) => (
              <div key={crop.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{crop.name}</h4>
                    <p className="text-sm text-gray-600">{crop.quantity} {crop.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">₹{(crop.price ?? crop.pricePerUnit)?.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">per {crop.unit.slice(0, -1)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderCropsContent = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <SearchAndFilter
        onSearch={setSearchQuery}
        onFiltersChange={setFilters}
        placeholder="Search your crops..."
        filterOptions={{
          showLocation: false,
          showRating: false
        }}
      />

      {/* Add Crop Open Button */}
      {!showCropForm && (
        <Button onClick={handleOpenCropForm} className="bg-green-600 hover:bg-green-700 mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Add New Crop Listing
        </Button>
      )}

      {/* Add Crop Form */}
      {showCropForm && (
        <MotionDiv
          ref={cropFormRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add New Crop Listing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Name</label>
                  <Input
                    value={cropForm.name}
                    onChange={(e) => setCropForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium Basmati Rice"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Type</label>
                  <Select value={cropForm.type} onValueChange={(value) => setCropForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity (tons)</label>
                  <Input
                    type="number"
                    value={cropForm.quantity}
                    onChange={(e) => setCropForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price per ton (₹)</label>
                  <Input
                    type="number"
                    value={cropForm.pricePerUnit}
                    onChange={(e) => setCropForm(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quality</label>
                  <Select value={cropForm.quality} onValueChange={(value) => setCropForm(prev => ({ ...prev, quality: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Harvest Date</label>
                  <Input
                    type="date"
                    value={formatDateForInput(cropForm.harvestDate)}
                    onChange={(e) => setCropForm(prev => ({ ...prev, harvestDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input
                    type="date"
                    value={formatDateForInput(cropForm.expiryDate)}
                    onChange={(e) => setCropForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={cropForm.description}
                  onChange={(e) => setCropForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your crop quality, certifications, etc."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={cropForm.organic}
                  onChange={(e) => setCropForm(prev => ({ ...prev, organic: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="organic" className="text-sm font-medium">Organic Certified</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleClearCropForm} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddOrEditCrop} className="flex-1 bg-green-600 hover:bg-green-700">
                  {editingCropId ? 'Update Listing' : 'Add Listing'}
                </Button>
                {/* <Button variant="outline" onClick={() => setShowCropForm(false)} className="flex-1">
                  Close
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      )}

      {/* Add Clear All button above crops grid */}
      {filteredCrops.length > 0 && (
        <Button onClick={handleClearAllCrops} variant="destructive" className="mb-4">
          Clear All
        </Button>
      )}

      {/* Crops Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading crops...</p>
          </div>
        ) : filteredCrops.length > 0 ? (
          filteredCrops.map((crop) => (
            <motion.div key={crop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{crop.name}</h3>
                    <p className="text-gray-600">{crop.type}</p>
                  </div>
                  <Badge className={getStatusColor(crop.status)}>
                    {crop.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{crop.quantity} {crop.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span>{crop.quality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(crop.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-green-600">₹{(crop.price ?? crop.pricePerUnit)?.toLocaleString()}</span>
                  </div>
                </div>

                {crop.organic && (
                  <Badge variant="outline" className="mb-3 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Organic Certified
                  </Badge>
                )}

                <p className="text-sm text-gray-600 mb-4">{crop.description}</p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewCrop(crop)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditCrop(crop)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteCrop(crop._id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first crop listing'}
            </p>
            {!searchQuery && filteredCrops.length === 0 && (
              <Button onClick={() => handleClearCropForm()} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Crop
              </Button>
            )}
          </div>
        )}
      </div>

      {/* View Crop Modal/Card */}
      {viewingCrop && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30" onClick={handleCloseViewCrop} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full z-10"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{viewingCrop.name}</h3>
                <Button variant="ghost" size="sm" onClick={handleCloseViewCrop}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>{viewingCrop.quantity} {viewingCrop.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span>{viewingCrop.quality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(viewingCrop.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-green-600">₹{(viewingCrop.price ?? viewingCrop.pricePerUnit)?.toLocaleString()}</span>
                </div>
              </div>

              {viewingCrop.organic && (
                <Badge variant="outline" className="mb-4 bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Organic Certified
                </Badge>
              )}

              <p className="text-sm text-gray-600 mb-4">{viewingCrop.description}</p>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCloseViewCrop} className="flex-1">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleEditCrop(viewingCrop);
                    handleCloseViewCrop();
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Edit Listing
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderInquiriesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Factory Inquiries</h2>
        <Badge variant="outline">{inquiries.length} Active</Badge>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <motion.div key={inquiry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }} className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{inquiry.factory}</h3>
                  <p className="text-gray-600">Looking for {inquiry.crop}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getUrgencyColor(inquiry.urgency)}>
                    {inquiry.urgency} priority
                  </Badge>
                  <span className="text-sm text-gray-500">{inquiry.receivedTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>{inquiry.quantity} tons needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>Up to ₹{inquiry.maxPrice.toLocaleString()}/ton</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{inquiry.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span>By {inquiry.deliveryDate}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{inquiry.message}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleInquiryResponse(inquiry.id, 'reject')}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Decline
                </Button>
                <Button
                  onClick={() => handleInquiryResponse(inquiry.id, 'accept')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accept & Negotiate
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // --- Market & Matches Tab ---
  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [buyerSearch, setBuyerSearch] = useState('');
const [profileOpen, setProfileOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
const { user: selectedFactory, loading: profileLoading, error: profileError } = useUser(selectedUserId);
const [contactingId, setContactingId] = useState<string | null>(null);

const { state } = useAppContext();
  const { sendContact, loading: contactLoading, error: contactError, successMessage } = useContact();

const handleContact = async (receiverId) => {
  if (!state.user) return;
  
  setContactingId(receiverId); // Set the specific ID being contacted
  
  const success = await sendContact(state.user.id, receiverId, null, state.user.token);
  
  setContactingId(null); // Reset after completion
  
  if (success) {
    alert('Notification sent successfully!');
  } else {
    alert(contactError || 'Failed to send notification');
  }
};

const openProfile = (factoryId: string) => {
  setSelectedUserId(factoryId);
  setProfileOpen(true);
};

// Close modal
const closeProfile = () => {
  setSelectedUserId(null);
  setProfileOpen(false);
};
  useEffect(() => {
    async function fetchBuyers() {
      setBuyersLoading(true);
      try {
        // Fetch factories
        const res = await fetch('https://fram2factorybackend.vercel.app/api/users?role=factory');
        const factories = await res.json();
        // For each factory, fetch requirements
        const buyersWithReqs = await Promise.all(
          factories.map(async (factory) => {
            const reqRes = await fetch(`https://fram2factorybackend.vercel.app/api/requirements?factoryId=${factory._id}`);
            const requirements = await reqRes.json();
            return { ...factory, requirements };
          })
        );
        setBuyers(buyersWithReqs);
      } catch {
        setBuyers([]);
      } finally {
        setBuyersLoading(false);
      }
    }
    fetchBuyers();
  }, []);

  // Filter buyers by search
const filteredBuyers = buyers.filter(factory => {
  const search = buyerSearch.toLowerCase();

  // Check factory-level fields
  const matchesFactory =
    factory.name?.toLowerCase().includes(search) ||
    factory.location?.toLowerCase().includes(search) ||
    factory.company?.toLowerCase().includes(search);

  // Check requirements-level fields
  const matchesRequirements = factory.requirements?.some(req =>
    req.cropType?.toLowerCase().includes(search) ||
    req.quantity?.toString().includes(search) ||
    req.location?.toLowerCase().includes(search) ||
    req.price?.toString().includes(search)
  );

  return matchesFactory || matchesRequirements;
});

  const renderMarketContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-green-700">🏭 Find Buyers</h2>
      <p className="mb-2 text-blue-600 font-medium">AI Match</p>
      <Input
        className="mb-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 bg-blue-50 text-blue-900 placeholder:text-blue-400 rounded-lg"
        placeholder="Search factories, requirements..."
        value={buyerSearch}
        onChange={e => setBuyerSearch(e.target.value)}
      />
      <div className="mb-2 text-green-700 font-semibold">{filteredBuyers.length} Buyers Found</div>
      
{/* Profile Modal */}
{profileOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-11/12 md:w-2/3 p-6 relative shadow-lg">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        onClick={closeProfile}
      >✕</button>

      {profileLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      ) : profileError ? (
        <p className="text-red-500 text-center">{profileError}</p>
      ) : selectedFactory ? (
        <>
          <h2 className="text-2xl font-bold text-green-700 mb-2">{selectedFactory.name}</h2>
          <div className="text-blue-700 font-medium flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" /> {selectedFactory.location}
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-blue-100 text-blue-700">🎯 {selectedFactory.matchScore || '88'}% Match</Badge>
            <Badge className="bg-green-100 text-green-700"><Star className="w-4 h-4 mr-1" />{selectedFactory.rating || '0'}</Badge>
          </div>

          <p className="text-gray-700 mb-4">{selectedFactory.bio || 'No additional info available.'}</p>
          <div className="text-gray-600 mb-4">
            <p>Email: {selectedFactory.email}</p>
            <p>Phone: {selectedFactory.phone}</p>
            <p>Company: {selectedFactory.company}</p>
            <p>Joined: {new Date(selectedFactory.joinedDate).toLocaleDateString()}</p>
            <p>Total Contracts: {selectedFactory.totalContracts}</p>
          </div>

          <h3 className="font-semibold text-lg text-green-700 mb-2">Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredBuyers
              .filter(factory => factory._id === selectedFactory._id) // get only the selected factory
              .flatMap(factory => factory.requirements || [])         // flatten requirements array
              .map(req => (
                <div key={req._id} className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100 flex flex-col gap-1">
                  <span className="font-semibold text-green-700">{req.cropType}</span>
                  <span className="text-blue-700">{req.quantity} tons @ ₹{req.price || 'N/A'}/ton</span>
                  <span className="text-xs text-gray-500">Delivery: {req.location}</span>
                </div>
              ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No factory selected.</p>
      )}
    </div>
  </div>
)}

      {/* Filter UI here */}

      {buyersLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading buyers...</p>
        </div>
      ) : filteredBuyers.length > 0 ? (
        filteredBuyers.map((factory, idx) => (
          <motion.div
            key={factory._id || idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="mb-6 p-6 border border-green-100 rounded-2xl bg-gradient-to-r from-green-50 via-blue-50 to-white shadow-lg card-hover glass-effect smooth-bounce"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
              <div>
                <h3 className="font-semibold text-xl text-green-800">{factory.name}</h3>
                <div className="text-blue-700 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {factory.location}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="bg-blue-100 text-blue-700">🎯 {factory.matchScore || '88'}% Match</Badge>
                  <Badge className="bg-green-100 text-green-700"><Star className="w-4 h-4 mr-1" />{factory.rating}</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
  <Button
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
  onClick={() => handleContact(factory._id)}
  disabled={contactingId === factory._id} // Only disable THIS button
>
  {contactingId === factory._id ? 'Sending...' : 'Contact'}
</Button>   
            <Button variant="outline" className="px-4 py-2 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => openProfile(factory._id)}
                >View Profile</Button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {factory.requirements.map((req) => (
                <div key={req._id} className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100 flex flex-col gap-1">
                  <span className="font-semibold text-green-700">{req.cropType}</span>
                  <span className="text-blue-700">{req.quantity} tons @ ₹{req.price || 'N/A'}/ton</span>
                  <span className="text-xs text-gray-500">Delivery: {req.location}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-3 font-medium">{factory.company || 'Food Processing • Est. 2010'}</div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No buyers found</h3>
          <p className="text-gray-600 mb-4">Try again later or adjust your filters.</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'crops':
        return renderCropsContent();
      case 'inquiries':
        return renderInquiriesContent();
      case 'market':
        return renderMarketContent();
      default:
        return renderHomeContent();
    }
  };

  // Add Crop Form open handler
  const handleOpenCropForm = () => {
    setShowCropForm(true);
    setEditingCropId(null);
    setCropForm({
      name: '',
      type: '',
      quantity: '',
      pricePerUnit: '',
      quality: '',
      harvestDate: '',
      expiryDate: '',
      description: '',
      organic: false
    });
    if (cropFormRef.current) {
      cropFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick Actions Add Crop handler
  const handleQuickAddCrop = () => {
    setActiveTab('crops');
    setShowCropForm(true);
    setEditingCropId(null);
    setCropForm({
      name: '',
      type: '',
      quantity: '',
      pricePerUnit: '',
      quality: '',
      harvestDate: '',
      expiryDate: '',
      description: '',
      organic: false
    });
    if (cropFormRef.current) {
      cropFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add Clear All button
  const handleClearAllCrops = async () => {
    if (!user) return;
    const token = user.token;
    const success = await clearAllCrops(user.id, token);
    if (success) {
      refetch();
      addNotification({
        id: Date.now().toString(),
        userId: user.id,
        type: 'system',
        title: 'All Crops Cleared',
        message: 'All your crop listings have been deleted.',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  };

  // Add Delete Crop button handler
  const handleDeleteCrop = async (cropId) => {
    if (!user) return;
    const token = user.token;
    const success = await deleteCrop(cropId, token);
    if (success) {
      refetch();
      addNotification({
        id: Date.now().toString(),
        userId: user.id,
        type: 'system',
        title: 'Crop Deleted',
        message: 'Crop listing has been deleted.',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Farmer Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('notifications')}>
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pb-2">
          <div className="flex gap-4">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'crops', label: 'My Crops', icon: Package },
              { id: 'inquiries', label: 'Inquiries', icon: MessageCircle },
              { id: 'market', label: 'Market & Matches', icon: GitMerge }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'inquiries' && inquiries.length > 0 && (
                  <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                    {inquiries.length}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Home', screen: 'dashboard' },
            { id: 'matching', icon: GitMerge, label: 'Matching', screen: 'matching' },
            { id: 'contracts', icon: FileText, label: 'Contracts', screen: 'contracts' },
            { id: 'notifications', icon: Bell, label: 'Alerts', screen: 'notifications' },
            { id: 'profile', icon: User, label: 'Profile', screen: 'profile' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(tab.screen as Screen)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                'text-gray-600 hover:text-green-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
              {tab.id === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper to format date for input type="date"
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};