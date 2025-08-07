'use client';

import { WeatherData } from '@/types';
import { Heart, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  onAddFavorite: () => void;
  onRemoveFavorite: () => void;
  isFavorite: boolean;
  showForecast: boolean;
  canAddFavorite?: boolean;
  maxFavoritesReached?: boolean;
}

export default function WeatherCard({ 
  weather, 
  onAddFavorite, 
  onRemoveFavorite,
  isFavorite = false, 
  showForecast = false,
  canAddFavorite = true,
  maxFavoritesReached = false
}: WeatherCardProps) {
  const handleFavoriteClick = () => {
    if (isFavorite) {
      onRemoveFavorite();
    } else if (canAddFavorite && !maxFavoritesReached) {
      onAddFavorite();
    } else if (maxFavoritesReached) {
      alert('Vous avez atteint la limite de favoris. Passez premium pour avoir des favoris illimités !');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header avec ville et bouton favori */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-800">{weather.location.name}</h2>
        </div>
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full transition-all ${
            isFavorite
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : maxFavoritesReached
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
          }`}
          title={
            isFavorite 
              ? 'Retirer des favoris' 
              : maxFavoritesReached 
              ? 'Limite de favoris atteinte'
              : 'Ajouter aux favoris'
          }
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Météo actuelle */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img 
            src={weather.current.condition.icon} 
            alt={weather.current.condition.text}
            className="w-16 h-16"
          />
          <div>
            <div className="text-4xl font-bold text-gray-800">
              {weather.current.temp_c}°C
            </div>
            <div className="text-gray-600">{weather.current.condition.text}</div>
          </div>
        </div>

        {/* Détails météo */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1 justify-center">
            <Thermometer className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Ressenti {weather.current.feelslike_c}°C</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <Droplets className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{weather.current.wind_kph} km/h</span>
          </div>
        </div>
      </div>

      {/* Prévisions (si premium) */}
      {showForecast && weather.forecast && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Prévisions sur 5 jours</h3>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.forecastday.slice(0, 5).map((day, index) => (
              <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
                <img 
                  src={day.day.condition.icon} 
                  alt={day.day.condition.text}
                  className="w-8 h-8 mx-auto mb-1"
                />
                <div className="text-sm font-medium">
                  {day.day.avgtemp_c}°C
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si limite de favoris atteinte */}
      {maxFavoritesReached && !isFavorite && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Limite atteinte :</strong> Vous avez atteint le maximum de favoris.
            <br />
            <span className="text-xs">Passez premium pour avoir des favoris illimités !</span>
          </p>
        </div>
      )}
    </div>
  );
}

