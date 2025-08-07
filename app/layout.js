import './globals.css'

export const metadata = {
  title: 'MétéoApp - Météo en temps réel',
  description: 'Consultez la météo en temps réel et prévisions de n\'importe quelle ville. Créez un compte pour sauvegarder vos villes favorites.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
