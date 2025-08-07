'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { User } from '@/types';

export function usePremium(user: User | null) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    // Pour l'instant, on simule un statut premium basé sur les métadonnées utilisateur
    // En production, cela viendrait de la table profiles
    const checkPremiumStatus = async () => {
      try {
        setLoading(true);
        
        // Simulation : si l'utilisateur a un nom qui contient "premium", il est premium
        // En production, cela viendrait de la base de données
        const premiumStatus = user.name?.toLowerCase().includes('premium') || 
                             user.email?.toLowerCase().includes('premium') ||
                             user.is_premium;
        
        setIsPremium(premiumStatus);
      } catch (err) {
        console.error('Erreur checkPremiumStatus:', err);
        setError('Erreur lors de la vérification du statut premium');
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  const activatePremium = async () => {
    if (!user) {
      setError('Vous devez être connecté pour activer le premium');
      return { error: 'Vous devez être connecté' };
    }

    try {
      setLoading(true);
      
      // Simulation d'activation premium
      // En production, cela créerait un abonnement Stripe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPremium(true);
      
      // Mettre à jour les métadonnées utilisateur (simulation)
      const { error } = await supabase.auth.updateUser({
        data: { 
          name: user.name + ' (Premium)',
          is_premium: true,
          premium_activated_at: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Erreur activation premium:', error);
        setError('Erreur lors de l\'activation du premium');
        return { error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Erreur activatePremium:', err);
      setError('Erreur lors de l\'activation du premium');
      return { error: 'Erreur lors de l\'activation du premium' };
    } finally {
      setLoading(false);
    }
  };

  const deactivatePremium = async () => {
    if (!user) {
      setError('Vous devez être connecté pour désactiver le premium');
      return { error: 'Vous devez être connecté' };
    }

    try {
      setLoading(true);
      
      // Simulation de désactivation premium
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPremium(false);
      
      // Mettre à jour les métadonnées utilisateur (simulation)
      const { error } = await supabase.auth.updateUser({
        data: { 
          name: user.name?.replace(' (Premium)', ''),
          is_premium: false,
          premium_activated_at: null
        }
      });

      if (error) {
        console.error('Erreur désactivation premium:', error);
        setError('Erreur lors de la désactivation du premium');
        return { error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Erreur deactivatePremium:', err);
      setError('Erreur lors de la désactivation du premium');
      return { error: 'Erreur lors de la désactivation du premium' };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isPremium,
    loading,
    error,
    activatePremium,
    deactivatePremium,
    clearError,
  };
}
