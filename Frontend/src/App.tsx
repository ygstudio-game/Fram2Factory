import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { LoginRegistration } from './components/LoginRegistration';
import { FactoryDashboard } from './components/FactoryDashboard';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AIMatching } from './components/AIMatching';
import { ContractPayment } from './components/ContractPayment';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { apiService } from './services/api';

const AppContent: React.FC = () => {
  const { state, navigateToScreen, setUser, logout, setError } = useAppContext();

  // Auto transition from splash to onboarding
  useEffect(() => {
    if (state.currentScreen === 'splash') {
      const timer = setTimeout(() => {
        navigateToScreen('onboarding');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.currentScreen, navigateToScreen]);

  // Check for existing user session on app start
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          navigateToScreen('dashboard');
        }
      } catch (error) {
        console.error('Failed to check existing session:', error);
      }
    };

    if (state.currentScreen === 'onboarding' || state.currentScreen === 'login') {
      checkExistingSession();
    }
  }, [setUser, navigateToScreen, state.currentScreen]);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingCarousel onComplete={() => navigateToScreen('login')} />;
      case 'login':
        return (
          <LoginRegistration 
            onLogin={(user) => {
              setUser(user);
              navigateToScreen('dashboard');
            }} 
          />
        );
      case 'dashboard':
        return state.user?.role === 'factory' ? (
          <FactoryDashboard 
            user={state.user} 
            onNavigate={navigateToScreen}
          />
        ) : (
          <FarmerDashboard 
            user={state.user} 
            onNavigate={navigateToScreen}
          />
        );
      case 'matching':
        return <AIMatching user={state.user} onNavigate={navigateToScreen} />;
      case 'contracts':
        return <ContractPayment user={state.user} onNavigate={navigateToScreen} />;
      case 'notifications':
        return <Notifications user={state.user} onNavigate={navigateToScreen} />;
      case 'profile':
        return <Profile user={state.user} onNavigate={navigateToScreen} onLogout={logout} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {renderScreen()}
      {state.loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
      {state.error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <p>{state.error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-red-100 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}