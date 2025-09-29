// Core Types for Farm2Factory Platform

export type UserRole = 'farmer' | 'factory' | null;
export type Screen = 'splash' | 'onboarding' | 'login' | 'dashboard' | 'matching' | 'contracts' | 'notifications' | 'profile';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  verified: boolean;
  avatar?: string;
  phone?: string;
  company?: string;
  rating: number;
  totalContracts: number;
  joinedDate: string;
  certifications: string[];
  bio?: string;
  token?: string; // <-- Added for JWT support
}

export interface Farmer extends User {
  role: 'farmer';
  farmSize: number;
  crops: Crop[];
  farmType: string;
  successfulDeliveries: number;
  totalRevenue: number;
  organicCertified: boolean;
}

export interface Factory extends User {
  role: 'factory';
  industry: string;
  requirements: Requirement[];
  ordersCompleted: number;
  processingCapacity: number;
  totalProcurement: number;
  qualityStandards: string[];
}

export interface Crop {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  harvestDate: string;
  expiryDate: string;
  quality: 'Premium' | 'Standard' | 'Basic';
  location: string;
  organic: boolean;
  images: string[];
  description: string;
  farmerId: string;
  status: 'available' | 'reserved' | 'sold';
}

export interface Requirement {
  id: string;
  cropType: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  deliveryDate: string;
  location: string;
  qualityRequirements: string[];
  description: string;
  factoryId: string;
  status: 'active' | 'fulfilled' | 'closed';
  urgent: boolean;
}

export interface Contract {
  id: string;
  farmerId: string;
  factoryId: string;
  farmerName: string;
  factoryName: string;
  cropType: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  totalAmount: number;
  deliveryDate: string;
  deliveryLocation: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
  createdDate: string;
  paymentStatus: 'pending' | 'advance_paid' | 'completed';
  terms: string[];
  milestones: ContractMilestone[];
}

export interface ContractMilestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  completedDate?: string;
  amount?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'contract' | 'payment' | 'delivery' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}

export interface Match {
  id: string;
  farmerId: string;
  factoryId: string;
  cropId?: string;
  requirementId?: string;
  compatibilityScore: number;
  reason: string;
  status: 'new' | 'viewed' | 'contacted' | 'contracted';
  createdAt: string;
  farmer: Farmer;
  factory: Factory;
  crop?: Crop;
  requirement?: Requirement;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  contractId?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'document';
}

export interface SearchFilters {
  location?: string;
  cropType?: string;
  priceRange?: [number, number];
  quality?: string[];
  organic?: boolean;
  deliveryDate?: string;
  quantity?: [number, number];
  rating?: number;
  verified?: boolean;
}

export interface AppState {
  currentScreen: Screen;
  user: User | null;
  showSplash: boolean;
  loading: boolean;
  error: string | null;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}