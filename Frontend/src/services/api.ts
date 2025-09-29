// API Service Layer - Ready for backend integration
import { User, Crop, Requirement, Contract, Match, Notification, SearchFilters, APIResponse } from '../types';
import { generateMockData } from '../data/mockData';
  // const baseUrl = 'http://localhost:5000/api'; // Will be configurable when connecting to real backend
  // const baseUrl = 'https://farm2factory.onrender.com/api';
  const baseUrl = 'https://fram2factorybackend.vercel.app/api';
 
// Mock API delay to simulate real network requests
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private baseUrl =  baseUrl; // Will be configurable when connecting to real backend
  private mockData: ReturnType<typeof generateMockData> | null = null;

  private getMockData() {
    if (!this.mockData) {
      this.mockData = generateMockData();
    }
    return this.mockData;
  }

  // Authentication
  async login(email: string, password: string, role: 'farmer' | 'factory'): Promise<APIResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token && data.user) {
        // Return user object and token
        return { success: true, data: { ...data.user, token: data.token } };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }
async register(userData: Partial<User>): Promise<APIResponse<User>> {
  try {
    const response = await fetch(`${this.baseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (response.ok && data.user && data.token) {
      return { success: true, data: { ...data.user, token: data.token } };
    } else {
      return { success: false, error: data.error || 'Registration failed' };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}


  async logout(): Promise<APIResponse<null>> {
    return { success: true };
  }
// Inside ApiService class
async sendContactNotification(senderId: string, receiverId: string, contract?: any, token?: string): Promise<APIResponse<{ message: string }>> {
  try {
    const response = await fetch(`${this.baseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ senderId, receiverId, contract })
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Failed to send contact email' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

  // User Management
  async getCurrentUser(): Promise<APIResponse<User>> {
    return { success: false, error: 'No user found' };
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<APIResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (response.ok && data.user) {
        return { success: true, data: data.user };
      } else {
        return { success: false, error: data.error || 'Update failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }
async getUserById(userId: string): Promise<APIResponse<User>> {
  try {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch user' };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}
  // Crops
  async getCrops(farmerId?: string, filters?: SearchFilters): Promise<APIResponse<Crop[]>> {
    try {
      let url = `${this.baseUrl}/products`;
      if (farmerId) {
        url += `?farmerId=${farmerId}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Failed to fetch crops' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }

  async addCrop(crop: Omit<Crop, 'id'>, token?: string): Promise<APIResponse<Crop>> {
    console.log(token);
    
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(crop)
      });
      const data = await response.json();
      if (response.ok && data._id) {
        return { success: true, data: { ...data, id: data._id } };
      } else {
        return { success: false, error: data.error || 'Failed to add crop' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }

async updateCrop(cropId: string, updates: Partial<Crop>, token?: string): Promise<APIResponse<Crop>> {
    console.log(token);

  try {
    const response = await fetch(`${this.baseUrl}/products/${cropId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    if (response.ok && data._id) {
      return { success: true, data: { ...data, id: data._id } };
    } else {
      return { success: false, error: data.error || 'Failed to update crop' };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

  // Requirements
  async getRequirements(factoryId?: string, filters?: SearchFilters): Promise<APIResponse<Requirement[]>> {
    try {
      let url = `${this.baseUrl}/requirements`;
      if (factoryId) {
        url += `?factoryId=${factoryId}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok && Array.isArray(result.data)) {
        return { success: true, data: result.data };
      } else if (response.ok && Array.isArray(result)) {
        // In case backend returns array directly
        return { success: true, data: result };
      } else {
        return { success: false, error: result.error || 'Failed to fetch requirements' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }

async addRequirement(requirement: Omit<Requirement, 'id'>, token?: string): Promise<APIResponse<Requirement>> {
  try {
    const response = await fetch(`${this.baseUrl}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(requirement)
    });
    const data = await response.json();
    if (response.ok && data._id) {
      return { success: true, data: { ...data, id: data._id } };
    } else {
      return { success: false, error: data.error || 'Failed to add requirement' };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

async updateRequirement(id: string, updates: Partial<Requirement>, token?: string): Promise<APIResponse<Requirement>> {
  try {
    const response = await fetch(`${this.baseUrl}/requirements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    if (response.ok && data._id) {
      return { success: true, data: { ...data, id: data._id } };
    } else {
      return { success: false, error: data.error || 'Failed to update requirement' };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}
async deleteRequirement(id: string, token?: string): Promise<APIResponse<null>> {
  try {
    const response = await fetch(`${this.baseUrl}/requirements/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (response.ok) {
      return { success: true, data: null };
    } else {
      const data = await response.json();
      return { success: false, error: data.error || 'Failed to delete requirement' };
    }
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

  // Contracts
  async getContracts(userId: string): Promise<APIResponse<Contract[]>> {
    await mockDelay();
    
    const contracts = this.getMockData().contracts.filter(
      c => c.farmerId === userId || c.factoryId === userId
    );

    return { success: true, data: contracts };
  }

  async createContract(contractData: Omit<Contract, 'id' | 'createdDate'>): Promise<APIResponse<Contract>> {
    await mockDelay();
    
    const newContract: Contract = {
      ...contractData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString()
    };

    this.getMockData().contracts.push(newContract);
    return { success: true, data: newContract };
  }

  async updateContract(contractId: string, updates: Partial<Contract>): Promise<APIResponse<Contract>> {
    await mockDelay();
    
    const mockData = this.getMockData();
    const contractIndex = mockData.contracts.findIndex(c => c.id === contractId);
    if (contractIndex !== -1) {
      mockData.contracts[contractIndex] = { ...mockData.contracts[contractIndex], ...updates };
      return { success: true, data: mockData.contracts[contractIndex] };
    }
    
    return { success: false, error: 'Contract not found' };
  }

  // Matches
  async getMatches(userId: string): Promise<APIResponse<Match[]>> {
    await mockDelay();
    
    const matches = this.getMockData().matches.filter(
      m => m.farmerId === userId || m.factoryId === userId
    );

    return { success: true, data: matches };
  }

  async generateMatches(userId: string): Promise<APIResponse<Match[]>> {
    await mockDelay();
    
    // AI matching logic would go here
    // For now, return existing matches
    const matches = this.getMockData().matches.filter(
      m => m.farmerId === userId || m.factoryId === userId
    );

    return { success: true, data: matches };
  }

  // Notifications
  async getNotifications(userId: string): Promise<APIResponse<Notification[]>> {
    await mockDelay();
    
    const notifications = this.getMockData().notifications.filter(n => n.userId === userId);
    return { success: true, data: notifications };
  }

  async markNotificationRead(notificationId: string): Promise<APIResponse<null>> {
    await mockDelay();
    
    const mockData = this.getMockData();
    const notificationIndex = mockData.notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      mockData.notifications[notificationIndex].read = true;
    }
    
    return { success: true };
  }

  // Search and Filters
  async searchUsers(query: string, role?: 'farmer' | 'factory', filters?: SearchFilters): Promise<APIResponse<User[]>> {
    await mockDelay();
    
    let users = this.getMockData().users.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.location.toLowerCase().includes(query.toLowerCase()) ||
      u.company?.toLowerCase().includes(query.toLowerCase())
    );

    if (role) {
      users = users.filter(u => u.role === role);
    }

    return { success: true, data: users };
  }

  private applyFilters(crops: Crop[], filters: SearchFilters): Crop[] {
    return crops.filter(crop => {
      if (filters.location && !crop.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.cropType && crop.type !== filters.cropType) {
        return false;
      }
      if (filters.organic !== undefined && crop.organic !== filters.organic) {
        return false;
      }
      if (filters.quality && filters.quality.length > 0 && !filters.quality.includes(crop.quality)) {
        return false;
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (crop.pricePerUnit < min || crop.pricePerUnit > max) {
          return false;
        }
      }
      return true;
    });
  }
}

export const apiService = new ApiService();

export async function postRequirement(requirement, token) {
  try {
    const response = await fetch(`${baseUrl}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(requirement)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to post requirement');
    }
    return data;
  } catch (error) {
    throw error;
  }


}