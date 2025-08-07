import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'http://api.weatherapi.com/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Requête trop courte' }, { status: 400 });
  }

  if (!WEATHER_API_KEY) {
    return NextResponse.json({ error: 'Clé API météo manquante' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${WEATHER_API_URL}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur API recherche');
    }

    const data = await response.json();
    
    // Filtrer uniquement les villes françaises comme dans votre ancien code
    const villesFrancaises = data.filter((ville: any) => ville.country === "France");
    
    return NextResponse.json(villesFrancaises);
  } catch (error) {
    console.error('Erreur recherche:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Impossible de récupérer les suggestions' },
      { status: 500 }
    );
  }
}
