'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';
import { usePremium } from '@/hooks/usePremium';
import WeatherCard from '@/components/WeatherCard';
import FavoritesList from '@/components/FavoritesList';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { weather, loading: weatherLoading, error, fetchWeather } = useWeather();
  const { isPremium, loading: premiumLoading } = usePremium(user);
  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite, 
    getFavoriteId,
    maxFavorites,
    currentCount,
    canAddMore
  } = useFavorites(user?.id, isPremium);
  const router = useRouter();

  // Redirection automatique si l'utilisateur est connecté
  useEffect(() => {
    if (user && !loading) {
      console.log('🔄 Redirection vers dashboard...', { user: user.id, loading });
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Charger automatiquement la météo de Paris au chargement de la page
  useEffect(() => {
    if (!user && !loading) {
      // Si l'utilisateur n'est pas connecté, afficher la météo de Paris
      fetchWeather('Paris', 1);
    }
  }, [user, loading, fetchWeather]);

  const handleSearch = (city: string) => {
    fetchWeather(city, 1);
  };

  const handleAddFavorite = async () => {
    if (!weather || !user) return;
    
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
    fetchWeather(cityName, 1);
  };

  const handleRemoveFavoriteFromList = async (id: string) => {
    const result = await removeFavorite(id);
    if (result.error) {
      alert(result.error);
    }
  };

  // Afficher un chargement pendant la vérification de l'authentification
  if (loading || premiumLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher un message de redirection
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection vers le dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">MétéoApp</h1>
          <p className="text-xl text-gray-600 mb-6">
            Consultez la météo en temps réel de n'importe quelle ville
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Se connecter
            </Link>
            <Link 
              href="/register" 
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              S'inscrire
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recherche météo */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-center mb-6">Recherche instantanée</h2>
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} loading={weatherLoading} />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Affichage de la météo actuelle */}
            {weatherLoading && !weather ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de la météo...</p>
              </div>
            ) : weather ? (
              <div className="mb-8">
                <WeatherCard 
                  weather={weather} 
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                  isFavorite={isFavorite(weather.location.name)}
                  showForecast={false}
                  canAddFavorite={canAddMore}
                  maxFavoritesReached={!canAddMore}
                />
              </div>
            ) : null}
          </div>

          {/* Favoris (si connecté) */}
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

        {/* Fonctionnalités */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Météo en temps réel</h3>
              <p className="text-gray-600">
                Consultez la météo actuelle de n'importe quelle ville en quelques secondes
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Villes favorites</h3>
              <p className="text-gray-600">
                Sauvegardez vos villes préférées et accédez-y rapidement
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Prévisions premium</h3>
              <p className="text-gray-600">
                Passez premium pour obtenir des prévisions sur 5 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

