// Comprehensive Mock Data for Farm2Factory Platform
import { User, Farmer, Factory, Crop, Requirement, Contract, Match, Notification } from '../types';

export const generateMockData = () => {
  // Mock Users (Farmers and Factories)
  const users: (Farmer | Factory)[] = [
    // Farmers
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@farm.com',
      role: 'farmer',
      location: 'Punjab, India',
      verified: true,
      rating: 4.8,
      totalContracts: 23,
      joinedDate: '2023-01-15',
      certifications: ['Organic Certified', 'ISO 22000'],
      bio: 'Organic wheat and rice farmer with 15 years experience',
      phone: '+91 98765 43210',
      farmSize: 50,
      crops: [],
      farmType: 'Organic',
      organicCertified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@greenfarm.com',
      role: 'farmer',
      location: 'Karnataka, India',
      verified: true,
      rating: 4.6,
      totalContracts: 18,
      joinedDate: '2023-03-20',
      certifications: ['Fair Trade', 'Rainforest Alliance'],
      bio: 'Coffee and spice plantation owner',
      phone: '+91 87654 32109',
      farmSize: 30,
      crops: [],
      farmType: 'Plantation',
      organicCertified: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit@modernfarm.com',
      role: 'farmer',
      location: 'Gujarat, India',
      verified: true,
      rating: 4.9,
      totalContracts: 31,
      joinedDate: '2022-11-10',
      certifications: ['GAP Certified', 'Organic Certified'],
      bio: 'Innovative farmer specializing in vegetables and fruits',
      phone: '+91 76543 21098',
      farmSize: 25,
      crops: [],
      farmType: 'Mixed',
      organicCertified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    // Factories
    {
      id: '4',
      name: 'Suresh Foods Pvt Ltd',
      email: 'procurement@sureshfoods.com',
      role: 'factory',
      location: 'Mumbai, Maharashtra',
      verified: true,
      rating: 4.7,
      totalContracts: 45,
      joinedDate: '2022-08-15',
      certifications: ['FSSAI', 'HACCP', 'ISO 22000'],
      bio: 'Leading food processing company specializing in grains and pulses',
      phone: '+91 22 2345 6789',
      company: 'Suresh Foods Pvt Ltd',
      industry: 'Food Processing',
      requirements: [],
      processingCapacity: 1000,
      qualityStandards: ['Grade A', 'Organic', 'Export Quality'],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'Green Valley Industries',
      email: 'sourcing@greenvalley.com',
      role: 'factory',
      location: 'Bangalore, Karnataka',
      verified: true,
      rating: 4.5,
      totalContracts: 38,
      joinedDate: '2023-01-05',
      certifications: ['ISO 9001', 'BRC', 'Organic Certified'],
      bio: 'Organic food products manufacturer and exporter',
      phone: '+91 80 1234 5678',
      company: 'Green Valley Industries',
      industry: 'Organic Food Processing',
      requirements: [],
      processingCapacity: 800,
      qualityStandards: ['Organic', 'Fair Trade', 'Non-GMO'],
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
    }
  ];

  // Mock Crops
  const crops: Crop[] = [
    {
      id: 'c1',
      name: 'Premium Basmati Rice',
      type: 'Rice',
      quantity: 500,
      unit: 'tons',
      pricePerUnit: 45000,
      harvestDate: '2024-11-15',
      expiryDate: '2025-11-15',
      quality: 'Premium',
      location: 'Punjab, India',
      organic: true,
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'],
      description: 'Premium quality basmati rice, aged for 2 years. Perfect aroma and taste.',
      farmerId: '1',
      status: 'available'
    },
    {
      id: 'c2',
      name: 'Organic Coffee Beans',
      type: 'Coffee',
      quantity: 200,
      unit: 'tons',
      pricePerUnit: 180000,
      harvestDate: '2024-12-01',
      expiryDate: '2025-12-01',
      quality: 'Premium',
      location: 'Karnataka, India',
      organic: true,
      images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop'],
      description: 'Single origin arabica coffee beans from high altitude plantations.',
      farmerId: '2',
      status: 'available'
    },
    {
      id: 'c3',
      name: 'Fresh Tomatoes',
      type: 'Vegetables',
      quantity: 50,
      unit: 'tons',
      pricePerUnit: 25000,
      harvestDate: '2024-10-20',
      expiryDate: '2024-11-05',
      quality: 'Standard',
      location: 'Gujarat, India',
      organic: false,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop'],
      description: 'Fresh, red ripe tomatoes. Perfect for processing and cooking.',
      farmerId: '3',
      status: 'available'
    },
    {
      id: 'c4',
      name: 'Organic Wheat',
      type: 'Wheat',
      quantity: 300,
      unit: 'tons',
      pricePerUnit: 28000,
      harvestDate: '2024-04-15',
      expiryDate: '2025-04-15',
      quality: 'Premium',
      location: 'Punjab, India',
      organic: true,
      images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'],
      description: 'Certified organic wheat with high protein content.',
      farmerId: '1',
      status: 'available'
    }
  ];

  // Mock Requirements
  const requirements: Requirement[] = [
    {
      id: 'r1',
      cropType: 'Rice',
      quantity: 200,
      unit: 'tons',
      maxPrice: 50000,
      deliveryDate: '2024-12-15',
      location: 'Mumbai, Maharashtra',
      qualityRequirements: ['Premium Grade', 'Aged', 'Low Moisture'],
      description: 'Looking for premium basmati rice for export quality processing.',
      factoryId: '4',
      status: 'active',
      urgent: true
    },
    {
      id: 'r2',
      cropType: 'Coffee',
      quantity: 100,
      unit: 'tons',
      maxPrice: 200000,
      deliveryDate: '2024-12-30',
      location: 'Bangalore, Karnataka',
      qualityRequirements: ['Organic Certified', 'Single Origin', 'AA Grade'],
      description: 'Organic coffee beans for premium coffee products.',
      factoryId: '5',
      status: 'active',
      urgent: false
    },
    {
      id: 'r3',
      cropType: 'Wheat',
      quantity: 150,
      unit: 'tons',
      maxPrice: 30000,
      deliveryDate: '2024-11-30',
      location: 'Mumbai, Maharashtra',
      qualityRequirements: ['High Protein', 'Organic Certified'],
      description: 'Organic wheat for flour production.',
      factoryId: '4',
      status: 'active',
      urgent: false
    }
  ];

  // Mock Contracts
  const contracts: Contract[] = [
    {
      id: 'ct1',
      farmerId: '1',
      factoryId: '4',
      farmerName: 'Rajesh Kumar',
      factoryName: 'Suresh Foods Pvt Ltd',
      cropType: 'Rice',
      quantity: 100,
      unit: 'tons',
      agreedPrice: 48000,
      totalAmount: 4800000,
      deliveryDate: '2024-12-10',
      deliveryLocation: 'Mumbai, Maharashtra',
      status: 'in_progress',
      createdDate: '2024-10-15',
      paymentStatus: 'advance_paid',
      terms: ['Quality inspection required', 'Advance payment 30%', 'Delivery in covered trucks'],
      milestones: [
        {
          id: 'm1',
          title: 'Contract Signed',
          description: 'Digital contract signed by both parties',
          status: 'completed',
          completedDate: '2024-10-15'
        },
        {
          id: 'm2',
          title: 'Advance Payment',
          description: '30% advance payment completed',
          status: 'completed',
          completedDate: '2024-10-18',
          amount: 1440000
        },
        {
          id: 'm3',
          title: 'Quality Inspection',
          description: 'Pre-delivery quality inspection',
          status: 'pending'
        },
        {
          id: 'm4',
          title: 'Delivery',
          description: 'Final delivery and acceptance',
          status: 'pending'
        }
      ]
    },
    {
      id: 'ct2',
      farmerId: '2',
      factoryId: '5',
      farmerName: 'Priya Sharma',
      factoryName: 'Green Valley Industries',
      cropType: 'Coffee',
      quantity: 50,
      unit: 'tons',
      agreedPrice: 185000,
      totalAmount: 9250000,
      deliveryDate: '2024-12-20',
      deliveryLocation: 'Bangalore, Karnataka',
      status: 'accepted',
      createdDate: '2024-10-20',
      paymentStatus: 'pending',
      terms: ['Organic certification required', 'Moisture content < 12%', 'No foreign materials'],
      milestones: [
        {
          id: 'm5',
          title: 'Contract Signed',
          description: 'Digital contract signed by both parties',
          status: 'completed',
          completedDate: '2024-10-20'
        },
        {
          id: 'm6',
          title: 'Quality Verification',
          description: 'Organic certification verification',
          status: 'pending'
        }
      ]
    }
  ];

  // Mock Matches
  const matches: Match[] = [
    {
      id: 'm1',
      farmerId: '1',
      factoryId: '4',
      cropId: 'c1',
      requirementId: 'r1',
      compatibilityScore: 95,
      reason: 'Perfect match: Premium basmati rice meets all quality requirements and location proximity',
      status: 'contracted',
      createdAt: '2024-10-10',
      farmer: users.find(u => u.id === '1') as Farmer,
      factory: users.find(u => u.id === '4') as Factory,
      crop: crops.find(c => c.id === 'c1'),
      requirement: requirements.find(r => r.id === 'r1')
    },
    {
      id: 'm2',
      farmerId: '2',
      factoryId: '5',
      cropId: 'c2',
      requirementId: 'r2',
      compatibilityScore: 88,
      reason: 'Good match: Organic coffee beans with premium quality and same state location',
      status: 'viewed',
      createdAt: '2024-10-18',
      farmer: users.find(u => u.id === '2') as Farmer,
      factory: users.find(u => u.id === '5') as Factory,
      crop: crops.find(c => c.id === 'c2'),
      requirement: requirements.find(r => r.id === 'r2')
    },
    {
      id: 'm3',
      farmerId: '3',
      factoryId: '4',
      cropId: 'c3',
      compatibilityScore: 75,
      reason: 'Moderate match: Fresh vegetables available, price negotiable',
      status: 'new',
      createdAt: '2024-10-22',
      farmer: users.find(u => u.id === '3') as Farmer,
      factory: users.find(u => u.id === '4') as Factory,
      crop: crops.find(c => c.id === 'c3')
    }
  ];

  // Mock Notifications
  const notifications: Notification[] = [
    {
      id: 'n1',
      userId: '1',
      type: 'contract',
      title: 'Contract Milestone Completed',
      message: 'Advance payment received for Basmati Rice contract with Suresh Foods',
      read: false,
      createdAt: '2024-10-18T10:30:00Z',
      actionUrl: '/contracts',
      metadata: { contractId: 'ct1' }
    },
    {
      id: 'n2',
      userId: '4',
      type: 'match',
      title: 'New AI Match Found',
      message: 'High compatibility match found for your wheat requirement',
      read: true,
      createdAt: '2024-10-20T14:15:00Z',
      actionUrl: '/matching'
    },
    {
      id: 'n3',
      userId: '2',
      type: 'contract',
      title: 'Contract Accepted',
      message: 'Green Valley Industries accepted your coffee beans proposal',
      read: false,
      createdAt: '2024-10-20T16:45:00Z',
      actionUrl: '/contracts',
      metadata: { contractId: 'ct2' }
    },
    {
      id: 'n4',
      userId: '5',
      type: 'delivery',
      title: 'Delivery Schedule Reminder',
      message: 'Coffee beans delivery scheduled for Dec 20, 2024',
      read: false,
      createdAt: '2024-10-21T09:00:00Z',
      actionUrl: '/contracts'
    },
    {
      id: 'n5',
      userId: '1',
      type: 'payment',
      title: 'Payment Due Reminder',
      message: 'Final payment pending for completed wheat contract',
      read: false,
      createdAt: '2024-10-22T11:20:00Z',
      actionUrl: '/contracts'
    }
  ];

  return {
    users,
    crops,
    requirements,
    contracts,
    matches,
    notifications
  };
};