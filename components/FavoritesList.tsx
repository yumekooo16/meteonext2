'use client';

import { useState } from 'react';
import { Heart, MapPin, X } from 'lucide-react';
import { Favorite } from '@/types';

interface FavoritesListProps {
  favorites: Favorite[];
  onRemoveFavorite: (id: string) => void;
  onSelectFavorite: (cityName: string) => void;
  maxFavorites: number;
  currentCount: number;
}

export default function FavoritesList({
  favorites,
  onRemoveFavorite,
  onSelectFavorite,
  maxFavorites,
  currentCount
}: FavoritesListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Mes Favoris
        </h3>
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Aucun favori pour le moment</p>
          <p className="text-sm text-gray-500">
            Ajoutez des villes à vos favoris pour y accéder rapidement
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Mes Favoris
        </h3>
        <span className="text-sm text-gray-500">
          {currentCount}/{maxFavorites}
        </span>
      </div>

      <div className="space-y-3">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
            onMouseEnter={() => setHoveredId(favorite.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectFavorite(favorite.city_name)}
          >
            <div className="flex items-center gap-3 flex-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-800">
                {favorite.city_name}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(favorite.id);
              }}
              className={`p-1 rounded-full transition-all ${
                hoveredId === favorite.id
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'text-gray-400 hover:text-red-600'
              }`}
              title="Retirer des favoris"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {currentCount >= maxFavorites && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Limite atteinte :</strong> Vous avez atteint le maximum de {maxFavorites} favoris.
            {maxFavorites === 3 && (
              <span className="block mt-1">
                Passez premium pour avoir des favoris illimités !
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
