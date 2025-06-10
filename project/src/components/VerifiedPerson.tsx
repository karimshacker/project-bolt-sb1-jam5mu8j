import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, User, RotateCcw, LogIn, LogOut, Database } from 'lucide-react';
import { Person } from '../types';
import { useUserSessions } from '../hooks/useUserSessions';
import { isSupabaseConfigured } from '../lib/supabase';

interface VerifiedPersonProps {
  person: Person;
  onContinueScanning: () => void;
}

export const VerifiedPerson: React.FC<VerifiedPersonProps> = ({ 
  person, 
  onContinueScanning 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { checkUserLoginStatus, loginUser, logoutUser, loading } = useUserSessions();

  // Check initial login status
  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      if (!isSupabaseConfigured()) return;
      
      try {
        const status = await checkUserLoginStatus(person.uniqueId);
        if (mounted) {
          setIsLoggedIn(status);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkStatus();

    return () => {
      mounted = false;
    };
  }, [person.uniqueId, checkUserLoginStatus]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleLogin = async () => {
    if (loading) return;

    const result = await loginUser(person);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    
    if (result.success) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    if (loading) return;

    const result = await logoutUser(person);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    
    if (result.success) {
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verified!</h2>
        <p className="text-green-100">Identity confirmed successfully</p>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-600" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {person.firstName} {person.lastName}
          </h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p><span className="font-medium">ID:</span> {person.idNumber}</p>
            <p><span className="font-medium">Affiliation:</span> {person.affiliation}</p>
            <p><span className="font-medium">DOB:</span> {new Date(person.dateOfBirth).toLocaleDateString()}</p>
          </div>

          {/* Database Status */}
          {!isSupabaseConfigured() ? (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-amber-700">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Database not connected</span>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                Connect to Supabase to enable login/logout functionality
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                isLoggedIn 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isLoggedIn ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span>{isLoggedIn ? 'Currently Logged In' : 'Not Logged In'}</span>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
        </div>
        
        {/* Login/Logout Buttons */}
        {isSupabaseConfigured() && (
          <div className="space-y-3 mb-4">
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>{loading ? 'Processing...' : 'Login (Enter)'}</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>{loading ? 'Processing...' : 'Logout (Exit)'}</span>
              </button>
            )}
          </div>
        )}
        
        <button
          onClick={onContinueScanning}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Scan Another</span>
        </button>
      </div>
    </div>
  );
};