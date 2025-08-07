'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';
import { usePremium } from '@/hooks/usePremium';
import WeatherCard from '@/components/WeatherCard';
import FavoritesList from '@/components/FavoritesList';
import SearchBar from '@/components/SearchBar';
import { LogOut, Crown, User, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { weather, loading: weatherLoading, error, fetchWeather } = useWeather();
  const { isPremium, loading: premiumLoading } = usePremium(user);
  const { 
    favorites, 
    loading: favoritesLoading, 
    addFavorite, 
    removeFavorite, 
    isFavorite, 
    getFavoriteId,
    maxFavorites,
    currentCount,
    canAddMore,
    error: favoritesError
  } = useFavorites(user?.id, isPremium);

  const handleSearch = (city: string) => {
    fetchWeather(city, isPremium ? 5 : 1);
  };

  const handleAddFavorite = async () => {
    if (!weather) return;
    
    const result = await addFavorite(weather.location.name);
    if (result.error) {
      alert(result.error);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!weather) return;
    
    const favoriteId = getFavoriteId(weather.location.name);
    if (favoriteId) {
      const result = await removeFavorite(favoriteId);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  const handleSelectFavorite = (cityName: string) => {
    fetchWeather(cityName, isPremium ? 5 : 1);
  };

  const handleRemoveFavoriteFromList = async (id: string) => {
    const result = await removeFavorite(id);
    if (result.error) {
      alert(result.error);
    }
  };

  if (authLoading || premiumLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder au dashboard</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            {isPremium && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-3 py-1 rounded-full border border-yellow-300">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Premium</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Bonjour, {user.name || user.email}</span>
            <Link 
              href="/profile"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <User className="w-4 h-4" />
              Profil
            </Link>
            <Link 
              href="/premium"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Zap className="w-4 h-4" />
              Premium
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Bannière Premium */}
        {!isPremium && (
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Passez Premium !</h3>
                  <p className="text-sm text-yellow-700">
                    Débloquez les prévisions 5 jours et les favoris illimités
                  </p>
                </div>
              </div>
              <Link 
                href="/premium"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 text-sm font-medium"
              >
                Découvrir
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recherche et météo */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recherche météo</h2>
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} loading={weatherLoading} />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {weather && (
              <WeatherCard 
                weather={weather} 
                onAddFavorite={handleAddFavorite}
                onRemoveFavorite={handleRemoveFavorite}
                isFavorite={isFavorite(weather.location.name)}
                showForecast={isPremium}
                canAddFavorite={canAddMore}
                maxFavoritesReached={!canAddMore}
              />
            )}
          </div>

          {/* Favoris */}
          <div>
            <FavoritesList
              favorites={favorites}
              onRemoveFavorite={handleRemoveFavoriteFromList}
              onSelectFavorite={handleSelectFavorite}
              maxFavorites={maxFavorites}
              currentCount={currentCount}
            />
          </div>
        </div>

        {/* Messages d'erreur des favoris */}
        {favoritesError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{favoritesError}</p>
          </div>
        )}

        {/* Statut des fonctionnalités */}
        <div className="mt-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">✅ Fonctionnalités actives</h3>
            <div className="space-y-2 text-sm">
              <p>✅ Authentification Supabase</p>
              <p>✅ Recherche météo</p>
              <p>✅ Gestion du profil utilisateur</p>
              <p>✅ Système de favoris ({maxFavorites} max)</p>
              {isPremium ? (
                <>
                  <p>✅ Abonnement premium actif</p>
                  <p>✅ Prévisions sur 5 jours</p>
                  <p>✅ Favoris illimités</p>
                </>
              ) : (
                <p>⏳ Prévisions 5 jours (premium requis)</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

