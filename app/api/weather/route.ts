import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'http://api.weatherapi.com/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const days = searchParams.get('days') || '1';

  if (!city) {
    return NextResponse.json({ error: 'Ville requise' }, { status: 400 });
  }

  if (!WEATHER_API_KEY) {
    return NextResponse.json({ error: 'Clé API météo manquante' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${WEATHER_API_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=${days}&aqi=no&lang=fr`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur API météo');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur météo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Impossible de récupérer les données météo' },
      { status: 500 }
    );
  }
}

