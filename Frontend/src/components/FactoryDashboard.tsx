import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Star, MapPin, Clock, Package, Bell, User, Home, GitMerge, FileText } from 'lucide-react';
import type { User, Screen } from '../types';
import { postRequirement, apiService } from '../services/api';
import { useAppContext } from '../context/AppContext';
 import { useContact} from '../hooks/useApi';
import { log } from 'console';

interface FactoryDashboardProps {
  user: UserType | null;
  onNavigate: (screen: Screen) => void;
}

// Create a MotionDiv that forwards ref
const MotionDiv = motion(forwardRef(function MotionDiv(props, ref) {
  return <div ref={ref} {...props} />;
}));
const suggestedFarmers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    location: 'Punjab, India',
    crops: ['Wheat', 'Rice'],
    rating: 4.8,
    distance: '45 km',
    quantity: '500 tons',
    certifications: ['Organic', 'ISO 9001'],
    matchScore: 95,
    price: '₹25,000/ton'
  },
  {
    id: '2',
    name: 'Sunita Farms',
    location: 'Haryana, India',
    crops: ['Corn', 'Soybeans'],
    rating: 4.6,
    distance: '67 km',
    quantity: '300 tons',
    certifications: ['Fair Trade'],
    matchScore: 88,
    price: '₹22,000/ton'
  },
  {
    id: '3',
    name: 'Green Valley Co-op',
    location: 'Uttar Pradesh, India',
    crops: ['Rice', 'Sugarcane'],
    rating: 4.9,
    distance: '89 km',
    quantity: '750 tons',
    certifications: ['Organic', 'Fair Trade'],
    matchScore: 92,
    price: '₹28,000/ton'
  }
];

const ongoingContracts = [
  {
    id: '1',
    farmer: 'Rajesh Kumar',
    crop: 'Wheat',
    quantity: '200 tons',
    status: 'In Transit',
    progress: 75,
    deliveryDate: '2024-01-15',
    amount: '₹50,00,000'
  },
  {
    id: '2',
    farmer: 'Sunita Farms',
    crop: 'Corn',
    quantity: '150 tons',
    status: 'Processing',
    progress: 45,
    deliveryDate: '2024-01-20',
    amount: '₹33,00,000'
  }
];
 
 

export function FactoryDashboard({ user, onNavigate }: FactoryDashboardProps) {
  
const [activeTab, setActiveTab] = useState<'home' | 'market' | 'matching' | 'contracts' | 'notifications' | 'profile'>('home');
  const [showPostRequirement, setShowPostRequirement] = useState(false);
  // Requirement form state
  const [requirementForm, setRequirementForm] = useState({ cropType: '', quantity: '', location: '' });
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState('');
  const [requirements, setRequirements] = useState([]);
    const [farmers, setFarmers] = useState<any[]>([]);
  const [farmersLoading, setFarmersLoading] = useState(true);
  const [farmerSearch, setFarmerSearch] = useState("");
const [selectedFarmer, setSelectedFarmer] = useState<any | null>(null);
 
  const [requirementsLoading, setRequirementsLoading] = useState(false);
const [editingRequirement, setEditingRequirement] = useState<any | null>(null);
const { state } = useAppContext();
  const { sendContact, loading: contactLoading, error: contactError, successMessage } = useContact();

  const handleContact = async (receiverId) => {
    if (!state.user) return;

    const success = await sendContact(state.user.id, receiverId, null, state.user.token);
    if (success) {
      alert('Notification sent successfully!'); // Or use a toast
    } else {
      alert(contactError || 'Failed to send notification');
    }
  };



  useEffect(() => {
    async function fetchFarmers() {
      setFarmersLoading(true);
      try {
        // 1. Fetch all farmers
        const res = await fetch("http://localhost:5000/api/users?role=farmer");
        const farmersList = await res.json();

        // 2. For each farmer, fetch their crops
        const farmersWithCrops = await Promise.all(
          farmersList.map(async (farmer: any) => {
            const cropRes = await fetch(
              `http://localhost:5000/api/products?farmerId=${farmer._id}`
            );
            const crops = await cropRes.json();
            return { ...farmer, crops };
          })
        );

        setFarmers(farmersWithCrops);
      } catch (err) {
        console.error("Failed to fetch farmers:", err);
        setFarmers([]);
      } finally {
        setFarmersLoading(false);
      }
    }
    fetchFarmers();
  }, []);

  // 🔍 Search filter for farmers + crops
const filteredFarmers = farmers.filter((farmer) => {
  const search = farmerSearch.toLowerCase();

  // Check if farmer basic info matches
  const matchesFarmer =
    farmer.name?.toLowerCase().includes(search) ||
    farmer.location?.toLowerCase().includes(search) ||
    farmer.email?.toLowerCase().includes(search);

  // Check if any of the farmer's crops match
  const matchesCrops = farmer.crops && farmer.crops.some((crop: any) => {
    return (
      crop.type?.toLowerCase().includes(search) ||
      crop.name?.toLowerCase().includes(search) ||
      crop.quality?.toLowerCase().includes(search) ||
      crop.status?.toLowerCase().includes(search) ||
      crop.location?.toLowerCase().includes(search)
    );
  });

  return matchesFarmer || matchesCrops;
});

const renderMarketContent = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-2 text-green-700">🌾 Find Farmers</h2>
    <p className="mb-2 text-blue-600 font-medium">AI Match</p>

    <Input
      className="mb-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 bg-blue-50 text-blue-900 placeholder:text-blue-400 rounded-lg"
      placeholder="Search farmers, crops..."
      value={farmerSearch}
      onChange={e => setFarmerSearch(e.target.value)}
    />

    <div className="mb-2 text-green-700 font-semibold">{filteredFarmers.length} Farmers Found</div>
    {/* open profile modal */}
{selectedFarmer && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl p-6 w-11/12 max-w-xl relative max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={() => setSelectedFarmer(null)}
      >
        ✕
      </button>

      {/* Header */}
      <div className="flex flex-col items-start gap-2">
        <h2 className="text-2xl font-bold text-green-700">{selectedFarmer.name}</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{selectedFarmer.location}</span>
        </div>
        <div className="flex gap-2 mt-1">
          <Badge className="bg-green-100 text-green-700">
            <Star className="w-4 h-4 mr-1" />
            {selectedFarmer.rating || '0'}
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-700">
            🎯 {selectedFarmer.matchScore || '85'}% Match
          </Badge>
        </div>
      </div>

      {/* Farmer Details */}
      <div className="mt-4 space-y-2 text-gray-700">
        <p><strong>Email:</strong> {selectedFarmer.email}</p>
        <p><strong>Phone:</strong> {selectedFarmer.phone || 'N/A'}</p>
        <p><strong>Farm Size:</strong> {selectedFarmer.farmSize || 'Smallholder • 5 Acres'}</p>
        <p><strong>Company:</strong> {selectedFarmer.company || 'Independent Farmer'}</p>
        <p><strong>Joined:</strong> {new Date(selectedFarmer.joinedDate).toLocaleDateString()}</p>
        {selectedFarmer.bio && <p><strong>Bio:</strong> {selectedFarmer.bio}</p>}
        {selectedFarmer.certifications && selectedFarmer.certifications.length > 0 && (
          <p><strong>Certifications:</strong> {selectedFarmer.certifications.join(', ')}</p>
        )}
      </div>

      {/* Crops */}
      {selectedFarmer.crops && selectedFarmer.crops.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-green-700 mb-2">Crops</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedFarmer.crops.map((crop: any, idx: number) => (
              <div key={idx} className="bg-yellow-50 rounded-lg p-3 border border-yellow-100 flex flex-col gap-1">
                <span className="font-semibold text-green-700">🌱 {crop.type || crop.name}</span>
                <span className="text-yellow-700">{crop.quantity} {crop.unit || 'tons'} @ ₹{crop.price || 'N/A'}/unit</span>
                <span className="text-xs text-gray-500">
                  Quality: {crop.quality || 'Standard'} | Status: {crop.status || 'N/A'}
                </span>
                <span className="text-xs text-gray-500">
                  Harvest: {crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString() : 'Immediate'} | Expiry: {crop.expiryDate ? new Date(crop.expiryDate).toLocaleDateString() : 'N/A'}
                </span>
                <span className="text-xs text-gray-500">Location: {crop.location || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements */}
      {selectedFarmer.requirements && selectedFarmer.requirements.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-green-700 mb-2">Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedFarmer.requirements.map((req: any, idx: number) => (
              <div key={idx} className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex flex-col gap-1 text-sm">
                <span className="font-semibold text-green-700">{req.cropType}</span>
                <span className="text-blue-700">{req.quantity} tons @ ₹{req.price || 'N/A'}/ton</span>
                <span className="text-xs text-gray-500">Delivery: {req.location}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images */}
      {selectedFarmer.images && selectedFarmer.images.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-green-700 mb-2">Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            {selectedFarmer.images.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`Farmer ${selectedFarmer.name}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}


    {farmersLoading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading farmers...</p>
      </div>
    ) : filteredFarmers.length > 0 ? (
      filteredFarmers.map((farmer, idx) => (
        <motion.div
          key={farmer._id || idx}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="mb-6 p-6 border border-green-100 rounded-2xl bg-gradient-to-r from-green-50 via-yellow-50 to-white shadow-lg card-hover glass-effect smooth-bounce"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
            <div>
              <h3 className="font-semibold text-xl text-green-800">{farmer.name}</h3>
              <div className="text-green-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {farmer.location}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-yellow-100 text-yellow-700">🎯 {farmer.matchScore || '85'}% Match</Badge>
                <Badge className="bg-green-100 text-green-700"><Star className="w-4 h-4 mr-1" />{farmer.rating}</Badge>
              </div>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
             <div className="flex gap-2 mt-2 md:mt-0">
  {/* Contact Button */}
      <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                  onClick={() => handleContact(farmer._id)}
                  disabled={contactLoading} // Disable while sending
                >
                  {contactLoading ? 'Sending...' : 'Contact'}
                </Button> 

  {/* View Profile Button */}
  <Button
    variant="outline"
    className="px-4 py-2 rounded-lg border-green-200 text-green-700 hover:bg-green-50"
  onClick={() => setSelectedFarmer(farmer)}
  >
    View Profile
  </Button>
</div>

            </div>
          </div>

          {/* Farmer Crops */}
     <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
  {farmer.crops.map((crop) => {
    // Format harvest date
    let harvestDate = 'Immediate';
    if (crop.harvestDate) {
      const date = new Date(crop.harvestDate);
      if (!isNaN(date.getTime())) {
        harvestDate = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
      }
    }

    // Format expiry date
    let expiryDate = 'N/A';
    if (crop.expiryDate) {
      const date = new Date(crop.expiryDate);
      if (!isNaN(date.getTime())) {
        expiryDate = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
      }
    }

    return (
      <div
        key={crop._id}
        className="text-sm bg-yellow-50 rounded-lg p-3 border border-yellow-100 flex flex-col gap-2"
      >
        {/* Crop Name/Type */}
        <span className="font-semibold text-green-700">
          🌱 {crop.type || crop.name}
        </span>

        {/* Quantity & Price */}
        <span className="text-yellow-700">
          {crop.quantity} {crop.unit || 'tons'} @ ₹{crop.price || 'N/A'}/unit
        </span>

        {/* Quality & Status */}
        <span className="text-xs text-gray-500">
          Quality: {crop.quality || 'Standard'} | Status: {crop.status || 'N/A'}
        </span>

        {/* Harvest & Expiry */}
        <span className="text-xs text-gray-500">
          Harvest Date: {harvestDate} | Expiry Date: {expiryDate}
        </span>

        {/* Location */}
        <span className="text-xs text-gray-500">
          Location: {crop.location || 'N/A'}
        </span>

        {/* Created By */}
        {crop.createdBy && (
          <span className="text-xs text-gray-500">
            Farmer: {crop.createdBy.name} ({crop.createdBy.email})
          </span>
        )}

        {/* Certifications */}
        {crop.certifications && crop.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {crop.certifications.map((cert: string, idx: number) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs text-green-700"
              >
                {cert}
              </Badge>
            ))}
          </div>
        )}

        {/* Organic */}
        {crop.organic && (
          <Badge className="bg-green-200 text-green-800 text-xs mt-1">
            Organic
          </Badge>
        )}

        {/* Images */}
        {crop.images && crop.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 ">
            {crop.images.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={crop.name}
                className="w-24 h-24 object-cover rounded-md border border-gray-200"
              />
            ))}
          </div>
        )}
      </div>
    );
  })}
</div>

          <div className="text-xs text-gray-500 mt-3 font-medium">{farmer.farmSize || 'Smallholder Farmer • 5 Acres'}</div>
        </motion.div>
      ))
    ) : (
      <div className="text-center py-8">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No farmers found</h3>
        <p className="text-gray-600 mb-4">Try again later or adjust your filters.</p>
      </div>
    )}
  </div>
);
 

// View Profile handler
const handleViewProfile = async (userId: string) => {
  try {
    const res = await fetch(`/api/users/${userId}`); // Your backend route
    if (!res.ok) throw new Error('Failed to fetch user');
    const userData = await res.json();
    
    // Open a profile modal or navigate to profile page
    console.log(userData);
    // Example: navigate to a profile page
    navigate(`/profile/${userId}`);
  } catch (err: any) {
    console.error(err);
    alert('Failed to load profile');
  }
};


const startEditing = (req: any) => {
  setEditingRequirement(req);
  setRequirementForm({
    cropType: req.cropType,
    quantity: req.quantity,
    price: req.price,
    location: req.location,
  });
  setShowPostRequirement(true);
};

  // Fetch requirements for this factory
  const fetchRequirements = async () => {
    if (!user?.id) return;
    setRequirementsLoading(true);
    const res = await apiService.getRequirements(user.id);
    
    try {
      if (res.success) setRequirements(res.data);
    } catch {
      setRequirements([]);
    } finally {
      setRequirementsLoading(false);
    }
  };

  // Fetch on mount and after posting
  React.useEffect(() => {
    fetchRequirements();
  }, [user?.id]);

const handlePostRequirement = async () => {
  setPosting(true);
  setPostSuccess(false);
  setPostError('');
  try {
    const payload = {
      cropType: requirementForm.cropType,
      quantity: Number(requirementForm.quantity),
      price: Number(requirementForm.price),
      location: requirementForm.location,
      factoryId: user?.id,
    };

    if (editingRequirement) {
      // Update existing requirement
      await apiService.updateRequirement(editingRequirement._id, payload, user?.token);
      setEditingRequirement(null);
    } else {
      // Create new requirement
      await postRequirement(payload, user?.token);
    }

    setPostSuccess(true);
    setRequirementForm({ cropType: '', quantity: '',price:'',location: '' });
    setShowPostRequirement(false);
    fetchRequirements();
  } catch (err) {
    setPostError('Failed to save requirement.',err);
    console.log(err);
  } finally {
    setPosting(false);
  }
};
const handleDeleteRequirement = async (id: string) => {
  if (!window.confirm('Are you sure you want to delete this requirement?')) return;
  try {
    await apiService.deleteRequirement(id, user?.token);
    fetchRequirements();
  } catch {
    alert('Failed to delete requirement.');
  }
};


  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
            >
              <h2 className="text-2xl mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-blue-100">Find quality agricultural products for your factory</p>
            </motion.div>

            {/* Post Requirement Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Post New Requirement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showPostRequirement ? (
                    <Button
                      onClick={() => setShowPostRequirement(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                    >
                      Create Requirement
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={requirementForm.cropType} onValueChange={value => setRequirementForm(f => ({ ...f, cropType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Crop Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Wheat">Wheat</SelectItem>
                            <SelectItem value="Rice">Rice</SelectItem>
                            <SelectItem value="Corn">Corn</SelectItem>
                            <SelectItem value="Soybeans">Soybeans</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Quantity (tons)"
                          type="number"
                          value={requirementForm.quantity}
                          onChange={e => setRequirementForm(f => ({ ...f, quantity: e.target.value }))}
                        />
                           <Input
                          placeholder="Price per ton (₹)"
                          type="number"
                          value={requirementForm.price}
                          onChange={e => setRequirementForm(f => ({ ...f, price: e.target.value }))}
                        />
                      </div>
                      <Input
                        placeholder="Delivery Location"
                        value={requirementForm.location}
                        onChange={e => setRequirementForm(f => ({ ...f, location: e.target.value }))}
                      />
                      {postError && <div className="text-red-600 text-sm">{postError}</div>}
                      {postSuccess && <div className="text-green-600 text-sm">Requirement posted successfully!</div>}
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowPostRequirement(false)} disabled={posting}>
                          Cancel
                        </Button>
                        <Button className="flex-1" onClick={handlePostRequirement} disabled={posting || !requirementForm.cropType || !requirementForm.quantity || !requirementForm.location}>
                          {posting ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-b-2 border-white rounded-full"></span> : null}
                          Post Requirement
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
   {/* Posted Requirements Section */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center justify-between">
      <span>Posted Requirements</span>
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {requirementsLoading ? (
      <div className="text-center text-gray-500">Loading requirements...</div>
    ) : requirements.length > 0 ? (
      requirements.map((req, idx) => (
        <motion.div
          key={req._id || req.id || idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border"
        >
          {/* Info */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-medium">{req.cropType}</h4>
              <div className="text-sm text-gray-600">{req.location}</div>
            </div>
            <Badge variant="secondary">{req.quantity} tons</Badge>
            <Badge variant="secondary">{req.price} ₹</Badge>
          </div>
          <div className="text-xs text-gray-500">
            Posted: {new Date(req.createdAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => startEditing(req)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteRequirement(req._id)}
            >
              Delete
            </Button>
          </div>
        </motion.div>
      ))
    ) : (
      <div className="text-center text-gray-500">No requirements posted yet.</div>
    )}
  </CardContent>
</Card>

            {/* Suggested Farmers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Suggested Farmers</span>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('matching')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestedFarmers.slice(0, 2).map((farmer) => (
                    <motion.div
                      key={farmer.id}
                      className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border hover:shadow-md transition-all duration-200 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{farmer.name}</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {farmer.location} • {farmer.distance}
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700"
                        >
                          {farmer.matchScore}% Match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{farmer.rating}</span>
                        </div>
                        <div className="flex gap-1">
                          {farmer.crops.map((crop) => (
                            <Badge key={crop} variant="outline" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{farmer.quantity} available</span>
                        <span className="font-medium text-green-600">{farmer.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Ongoing Contracts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Ongoing Contracts</span>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('contracts')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ongoingContracts.map((contract) => (
                    <div key={contract.id} className="p-4 rounded-xl bg-gray-50 border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{contract.farmer}</h4>
                          <p className="text-sm text-gray-600">{contract.crop} • {contract.quantity}</p>
                        </div>
                        <Badge variant={contract.status === 'In Transit' ? 'default' : 'secondary'}>
                          {contract.status}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${contract.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Due: {contract.deliveryDate}</span>
                        <span className="font-medium">{contract.amount}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

         
          </div>
        );
      case 'market':
      return renderMarketContent();
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2">Coming Soon</h3>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Factory Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('notifications')}>
            <Bell className="w-5 h-5" />
          </Button>
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
      { id: 'home', icon: Home, label: 'Home' },
      { id: 'market', icon: GitMerge, label: 'Market' },
      { id: 'matching', icon: GitMerge, label: 'Matching' },
      { id: 'contracts', icon: FileText, label: 'Contracts' },
      { id: 'notifications', icon: Bell, label: 'Alerts' },
      { id: 'profile', icon: User, label: 'Profile' }
    ].map((tab) => (
      <motion.button
        key={tab.id}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (['matching', 'contracts', 'notifications', 'profile'].includes(tab.id)) {
            onNavigate(tab.id as any);
          } else {
            setActiveTab(tab.id as any); // home or market
          }
        }}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
          activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
        }`}
      >
        <tab.icon className="w-5 h-5" />
        <span className="text-xs">{tab.label}</span>
      </motion.button>
    ))}
  </div>
</div>

    </div>
  );
}