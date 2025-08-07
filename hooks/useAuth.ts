'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
        if (authError) {
          console.error('Erreur auth:', authError);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (authUser) {
          // Créer un utilisateur de base sans dépendre de la table profiles
          const baseUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || '',
            is_premium: false,
            subscription_status: 'free',
            stripe_customer_id: '',
            stripe_subscription_id: '',
            premium_activated_at: '',
            created_at: authUser.created_at,
            updated_at: new Date().toISOString(),
          };
          
          setUser(baseUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur useAuth:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;
        
        if (session?.user) {
          // Créer un utilisateur de base sans dépendre de la table profiles
          const baseUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
            is_premium: false,
            subscription_status: 'free',
            stripe_customer_id: '',
            stripe_subscription_id: '',
            premium_activated_at: '',
            created_at: session.user.created_at,
            updated_at: new Date().toISOString(),
          };
          
          setUser(baseUser);
        } else {
          setUser(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Erreur signIn:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      // Ne pas essayer de créer un profil pour l'instant
      return { error };
    } catch (error) {
      console.error('Erreur signUp:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erreur signOut:', error);
    }
  };

  // Nouvelles fonctions CRUD
  const updateProfile = async (name: string, email: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        data: { name }
      });

      if (!error && user) {
        // Mettre à jour l'état local
        setUser({
          ...user,
          name,
          email,
          updated_at: new Date().toISOString(),
        });
      }

      return { error };
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      return { error: error as Error };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // D'abord, vérifier le mot de passe actuel
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        return { error: new Error('Mot de passe actuel incorrect') };
      }

      // Ensuite, mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      return { error };
    } catch (error) {
      console.error('Erreur updatePassword:', error);
      return { error: error as Error };
    }
  };

  const deleteAccount = async () => {
    try {
      // Supprimer l'utilisateur
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
      
      if (!error) {
        await signOut();
      }

      return { error };
    } catch (error) {
      console.error('Erreur deleteAccount:', error);
      return { error: error as Error };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    deleteAccount,
  };
}

