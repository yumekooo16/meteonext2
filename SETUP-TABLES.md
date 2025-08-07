# 🗄️ Configuration des Tables Supabase

## ✅ Étape 1 : Vérifier que l'application fonctionne

L'application devrait maintenant fonctionner sans les tables Supabase. Testez :

- ✅ Connexion/Inscription
- ✅ Recherche météo
- ✅ Dashboard basique

## 🗄️ Étape 2 : Créer les tables dans Supabase

1. **Allez dans votre projet Supabase**
2. **Ouvrez l'éditeur SQL**
3. **Copiez et exécutez ce script** :

```sql
-- Configuration de la base de données Supabase pour MétéoApp

-- Table des profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  premium_activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des favoris
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Index pour améliorer les performances
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);
CREATE INDEX idx_profiles_email ON profiles(email);
```

## 🔄 Étape 3 : Réactiver les fonctionnalités avancées

Une fois les tables créées, vous pouvez :

1. **Supprimer le composant DebugAuth** des pages
2. **Réactiver le hook useFavorites** dans le dashboard
3. **Tester les fonctionnalités favoris et premium**

## 🧪 Test de vérification

Exécutez ce script pour vérifier que tout fonctionne :

```bash
node check-database.js
```

## 🎯 Résultat attendu

Après configuration, vous devriez avoir :

- ✅ Authentification complète avec profils
- ✅ Système de favoris fonctionnel
- ✅ Gestion des abonnements premium
- ✅ Prévisions météo 5 jours pour les utilisateurs premium

---

**L'application fonctionne maintenant en mode basique !** 🎉
