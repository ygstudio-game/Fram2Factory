import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Screen, Notification, Contract, Match, Crop, Requirement } from '../types';

interface AppState {
  currentScreen: Screen;
  user: User | null;
  showSplash: boolean;
  loading: boolean;
  error: string | null;
  notifications: Notification[];
  contracts: Contract[];
  matches: Match[];
  crops: Crop[];
  requirements: Requirement[];
  searchQuery: string;
  activeFilters: any;
}

type AppAction =
  | { type: 'SET_SCREEN'; payload: Screen }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_CONTRACTS'; payload: Contract[] }
  | { type: 'UPDATE_CONTRACT'; payload: Contract }
  | { type: 'SET_MATCHES'; payload: Match[] }
  | { type: 'SET_CROPS'; payload: Crop[] }
  | { type: 'SET_REQUIREMENTS'; payload: Requirement[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: any }
  | { type: 'CLEAR_ERROR' };

const initialState: AppState = {
  currentScreen: 'splash',
  user: null,
  showSplash: true,
  loading: false,
  error: null,
  notifications: [],
  contracts: [],
  matches: [],
  crops: [],
  requirements: [],
  searchQuery: '',
  activeFilters: {}
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    case 'SET_CONTRACTS':
      return { ...state, contracts: action.payload };
    case 'UPDATE_CONTRACT':
      return {
        ...state,
        contracts: state.contracts.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    case 'SET_CROPS':
      return { ...state, crops: action.payload };
    case 'SET_REQUIREMENTS':
      return { ...state, requirements: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, activeFilters: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigateToScreen: (screen: Screen) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  updateContract: (contract: Contract) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigateToScreen = (screen: Screen) => {
    dispatch({ type: 'SET_SCREEN', payload: screen });
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const addNotification = (notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const updateContract = (contract: Contract) => {
    dispatch({ type: 'UPDATE_CONTRACT', payload: contract });
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_SCREEN', payload: 'login' });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
    dispatch({ type: 'SET_CONTRACTS', payload: [] });
    dispatch({ type: 'SET_MATCHES', payload: [] });
  };

  const value = {
    state,
    dispatch,
    navigateToScreen,
    setUser,
    setLoading,
    setError,
    addNotification,
    markNotificationRead,
    updateContract,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};