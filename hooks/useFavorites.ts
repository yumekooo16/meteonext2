'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { Favorite } from '@/types';

export function useFavorites(userId: string | null, isPremium: boolean = false) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // Limite de favoris selon le statut
  const maxFavorites = isPremium ? 999 : 3; // 999 pour "illimité" en pratique

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur fetchFavorites:', error);
          setError('Erreur lors du chargement des favoris');
        } else {
          setFavorites(data || []);
        }
      } catch (err) {
        console.error('Erreur fetchFavorites:', err);
        setError('Erreur lors du chargement des favoris');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId, supabase]);

  const addFavorite = async (cityName: string) => {
    if (!userId) {
      setError('Vous devez être connecté pour ajouter des favoris');
      return { error: 'Vous devez être connecté' };
    }

    // Vérifier la limite
    if (!isPremium && favorites.length >= maxFavorites) {
      setError(`Vous avez atteint la limite de ${maxFavorites} favoris. Passez premium pour avoir des favoris illimités !`);
      return { error: 'Limite de favoris atteinte' };
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          city_name: cityName,
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur addFavorite:', error);
        setError('Erreur lors de l\'ajout du favori');
        return { error: error.message };
      }

      setFavorites(prev => [data, ...prev]);
      return { data };
    } catch (err) {
      console.error('Erreur addFavorite:', err);
      setError('Erreur lors de l\'ajout du favori');
      return { error: 'Erreur lors de l\'ajout du favori' };
    }
  };

  const removeFavorite = async (id: string) => {
    if (!userId) {
      setError('Vous devez être connecté pour supprimer des favoris');
      return { error: 'Vous devez être connecté' };
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur removeFavorite:', error);
        setError('Erreur lors de la suppression du favori');
        return { error: error.message };
      }

      setFavorites(prev => prev.filter(fav => fav.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Erreur removeFavorite:', err);
      setError('Erreur lors de la suppression du favori');
      return { error: 'Erreur lors de la suppression du favori' };
    }
  };

  const isFavorite = (cityName: string) => {
    return favorites.some(fav => fav.city_name.toLowerCase() === cityName.toLowerCase());
  };

  const getFavoriteId = (cityName: string) => {
    const favorite = favorites.find(fav => fav.city_name.toLowerCase() === cityName.toLowerCase());
    return favorite?.id;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    clearError,
    maxFavorites,
    currentCount: favorites.length,
    canAddMore: isPremium || favorites.length < maxFavorites,
  };
}

