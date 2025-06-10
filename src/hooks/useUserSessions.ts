import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Person } from '../types';

export const useUserSessions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUserLoginStatus = useCallback(async (uniqueId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      return false;
    }

    try {
      const { data, error: queryError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('unique_id', uniqueId)
        .eq('is_active', true)
        .single();

      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking login status:', err);
      return false;
    }
  }, []);

  const loginUser = useCallback(async (person: Person): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please try again.'
      };
    }

    setLoading(true);
    setError(null);

    try {
      // Check if user is already logged in
      const isLoggedIn = await checkUserLoginStatus(person.uniqueId);
      if (isLoggedIn) {
        return {
          success: false,
          message: `${person.firstName} ${person.lastName} is already logged in.`
        };
      }

      // Create new session
      const { error: insertError } = await supabase
        .from('user_sessions')
        .insert({
          unique_id: person.uniqueId,
          first_name: person.firstName,
          last_name: person.lastName,
          id_number: person.idNumber,
          affiliation: person.affiliation,
          is_active: true,
          logged_in_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      return {
        success: true,
        message: `${person.firstName} ${person.lastName} logged in successfully!`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login user';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [checkUserLoginStatus]);

  const logoutUser = useCallback(async (person: Person): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please try again.'
      };
    }

    setLoading(true);
    setError(null);

    try {
      // Get the current session
      const { data: currentSession, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('unique_id', person.uniqueId)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return {
            success: false,
            message: `${person.firstName} ${person.lastName} is not currently logged in.`
          };
        }
        throw fetchError;
      }

      if (!currentSession) {
        return {
          success: false,
          message: `${person.firstName} ${person.lastName} is not currently logged in.`
        };
      }

      // Update the session
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          logged_out_at: new Date().toISOString()
        })
        .eq('id', currentSession.id)
        .eq('is_active', true);

      if (updateError) throw updateError;

      return {
        success: true,
        message: `${person.firstName} ${person.lastName} logged out successfully!`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout user';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkUserLoginStatus,
    loginUser,
    logoutUser,
    loading,
    error
  };
};