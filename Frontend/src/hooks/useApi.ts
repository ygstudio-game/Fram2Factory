// Custom hooks for API operations
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { User, Crop, Requirement, Contract, Match, Notification, SearchFilters } from '../types';

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiCall();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'An error occurred');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Authentication hooks
export const useAuth = () => {
  const { state, setUser, setLoading, setError } = useAppContext();

  const login = async (email: string, password: string, role: 'farmer' | 'factory') => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login(email, password, role);
      return response; // Return full API response
    } catch (err) {
      setError('Network error occurred');
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.register(userData);
      return response; // Return full API response
    } catch (err) {
      setError('Network error occurred');
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.updateProfile(state.user.id, updates);
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setError(response.error || 'Update failed');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, updateProfile };
};

// Crops hooks
export const useCrops = (farmerId?: string, filters?: SearchFilters) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchCrops = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getCrops(farmerId, filters);
      if (response.success && response.data) {
        // Filter by farmerId if provided
        const filteredCrops = farmerId
          ? response.data.filter((crop: Crop) => crop.createdBy._id === farmerId)
          : response.data;

        setCrops(filteredCrops);
      } else {
        setError(response.error || 'Failed to fetch crops');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addCrop = async (crop, token) => {
    try {
      const response = await apiService.addCrop(crop, token);
      if (response.success && response.data) {
        setCrops(prev => [...prev, response.data]);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

const updateCrop = async (cropId: string, updates: Partial<Crop>, token?: string) => {
  try {
    const response = await apiService.updateCrop(cropId, updates, token);
    if (response.success && response.data) {
      setCrops(prev => prev.map(c => c.id === cropId ? response.data! : c));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
  // Add crop deletion logic
  const deleteCrop = async (cropId, token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${cropId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  };

  // Add clear all crops logic
  const clearAllCrops = async (farmerId, token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products?farmerId=${farmerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [farmerId, JSON.stringify(filters)]);

  return { crops, loading, error, addCrop, updateCrop, deleteCrop, clearAllCrops, refetch: fetchCrops };
};

// Requirements hooks
export const useRequirements = (factoryId?: string) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getRequirements(factoryId);
      if (response.success && response.data) {
        setRequirements(response.data);
      } else {
        setError(response.error || 'Failed to fetch requirements');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = async (requirement: Omit<Requirement, 'id'>) => {
    try {
      const response = await apiService.addRequirement(requirement);
      if (response.success && response.data) {
        setRequirements(prev => [...prev, response.data!]);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [factoryId]);

  return { requirements, loading, error, addRequirement, refetch: fetchRequirements };
};

// Contracts hooks
export const useContracts = (userId?: string) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getContracts(userId);
      if (response.success && response.data) {
        setContracts(response.data);
      } else {
        setError(response.error || 'Failed to fetch contracts');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (contractId: string, updates: Partial<Contract>) => {
    try {
      const response = await apiService.updateContract(contractId, updates);
      if (response.success && response.data) {
        setContracts(prev => prev.map(c => c.id === contractId ? response.data! : c));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const createContract = async (contractData: Omit<Contract, 'id' | 'createdDate'>) => {
    try {
      const response = await apiService.createContract(contractData);
      if (response.success && response.data) {
        setContracts(prev => [...prev, response.data!]);
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [userId]);

  return { contracts, loading, error, updateContract, createContract, refetch: fetchContracts };
};

// Matches hooks
export const useMatches = (userId?: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getMatches(userId);
      if (response.success && response.data) {
        setMatches(response.data);
      } else {
        setError(response.error || 'Failed to fetch matches');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateMatches = async () => {
    if (!userId) return false;

    try {
      const response = await apiService.generateMatches(userId);
      if (response.success && response.data) {
        setMatches(response.data);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [userId]);

  return { matches, loading, error, generateMatches, refetch: fetchMatches };
};
export const useUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response: APIResponse<User> = await apiService.getUserById(id);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.error || 'Failed to fetch user');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId]);

  return { user, loading, error, refetch: () => fetchUser(userId) };
};

// Notifications hooks
export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getNotifications(userId);
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setError(response.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await apiService.markNotificationRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return { notifications, loading, error, markAsRead, refetch: fetchNotifications };
};

// Search hooks
export const useSearch = () => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, role?: 'farmer' | 'factory', filters?: SearchFilters) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.searchUsers(query, role, filters);
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      setError('Network error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};
export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sendContact = async (senderId: string, receiverId: string, contract?: any, token?: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiService.sendContactNotification(senderId, receiverId, contract, token);
      if (response.success && response.data) {
        setSuccessMessage(response.data.message);
        return true;
      } else {
        setError(response.error || 'Failed to send contact');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendContact, loading, error, successMessage };
};
// Market Crops hooks
export const useMarketCrops = (currentUserId?: string) => {
  const [marketCrops, setMarketCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketCrops = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getCrops();
      if (response.success && response.data) {
        // Filter out crops belonging to current user
        const filtered = response.data.filter(crop => crop.farmerId !== currentUserId);
        setMarketCrops(filtered);
      } else {
        setError(response.error || 'Failed to fetch market crops');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketCrops();
  }, [currentUserId]);

  return { marketCrops, loading, error, refetch: fetchMarketCrops };
};