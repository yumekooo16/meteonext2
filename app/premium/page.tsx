'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { Crown, Check, ArrowLeft, Star, Zap, Heart, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PremiumPage() {
  const { user, loading } = useAuth();
  const { isPremium, loading: premiumLoading, activatePremium, deactivatePremium, error } = usePremium(user);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivatePremium = async () => {
    setIsProcessing(true);
    const result = await activatePremium();
    if (result.error) {
      alert(result.error);
    } else {
      alert('Abonnement premium activé avec succès !');
    }
    setIsProcessing(false);
  };

  const handleDeactivatePremium = async () => {
    if (confirm('Êtes-vous sûr de vouloir désactiver votre abonnement premium ?')) {
      setIsProcessing(true);
      const result = await deactivatePremium();
      if (result.error) {
        alert(result.error);
      } else {
        alert('Abonnement premium désactivé.');
      }
      setIsProcessing(false);
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder aux abonnements premium</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>
        </div>

        {/* Titre */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Abonnement Premium</h1>
          <p className="text-xl text-gray-600">
            Débloquez toutes les fonctionnalités avancées de MétéoApp
          </p>
        </div>

        {/* Statut actuel */}
        {isPremium && (
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-yellow-800">Abonnement Premium Actif</h2>
            </div>
            <p className="text-yellow-700 mb-4">
              Félicitations ! Vous bénéficiez de toutes les fonctionnalités premium.
            </p>
            <button
              onClick={handleDeactivatePremium}
              disabled={isProcessing}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isProcessing ? 'Désactivation...' : 'Désactiver Premium'}
            </button>
          </div>
        )}

        {/* Plans d'abonnement */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plan Gratuit */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Plan Gratuit</h3>
              <div className="text-4xl font-bold text-gray-800 mb-1">0€</div>
              <p className="text-gray-600">Pour toujours</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Météo en temps réel</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Recherche de villes</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Jusqu'à 3 favoris</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span>Prévisions limitées</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-gray-500 text-sm">Plan actuel</div>
            </div>
          </div>

          {/* Plan Premium */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-300 relative">
            {isPremium && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Actif
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-yellow-600" />
                <h3 className="text-2xl font-bold text-gray-800">Plan Premium</h3>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-1">9.99€</div>
              <p className="text-gray-600">par mois</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Tout du plan gratuit</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Favoris illimités</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>Prévisions sur 5 jours</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Fonctionnalités avancées</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-purple-500" />
                <span>Support prioritaire</span>
              </div>
            </div>

            <div className="text-center">
              {isPremium ? (
                <div className="text-green-600 font-medium">Abonnement actif</div>
              ) : (
                <button
                  onClick={handleActivatePremium}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 font-medium"
                >
                  {isProcessing ? 'Activation...' : 'Activer Premium'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fonctionnalités détaillées */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Fonctionnalités Premium
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Favoris Illimités
              </h3>
              <p className="text-gray-600 mb-4">
                Ajoutez autant de villes que vous voulez à vos favoris. Plus de limite de 3 favoris !
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Sauvegardez toutes vos villes préférées</li>
                <li>• Accès rapide à vos destinations</li>
                <li>• Organisation personnalisée</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Prévisions 5 Jours
              </h3>
              <p className="text-gray-600 mb-4">
                Consultez les prévisions météo détaillées sur les 5 prochains jours pour chaque ville.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Prévisions jour par jour</li>
                <li>• Températures min/max</li>
                <li>• Conditions météo détaillées</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Note de simulation */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Note :</strong> Ceci est une simulation d'abonnement premium. 
            En production, cela utiliserait Stripe pour les paiements réels.
          </p>
        </div>
      </div>
    </div>
  );
}

