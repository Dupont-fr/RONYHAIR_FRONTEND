# Rony Hair 237 – Frontend

Application web du salon de coiffure **Rony Hair 237** (Douala, Cameroun). Ce dépôt contient le frontend React + Vite.

## 🚀 Lien en production

- Site : https://ronyhair237.de5.net (Vercel)
- API : https://ronyhair.de5.net (Render)

## 🧰 Stack technique

- **React 19** + **Vite 7**
- **React Router 7** (routing client-side)
- **Redux Toolkit** (gestion d'état)
- **Axios** (appels API)
- **Recharts** (graphiques du dashboard admin)
- **Cloudinary** (hébergement des images)
- **Framer Motion** (animations)
- **Socket.io-client** (temps réel)
- **Tailwind CSS 4**

## 📁 Structure

```
src/
├── main.jsx              # Point d'entrée
├── App.jsx               # Routes (lazy loading)
├── components/           # Composants React
│   ├── LandingPage/      # Page d'accueil animée
│   ├── admin/            # Espace administrateur
│   ├── styles/           # Fichiers CSS
│   └── ...
├── services/             # Appels API (apiConfig, publicService, etc.)
└── store/                # Redux store
```

## 🛠️ Commandes

```bash
npm install        # Installer les dépendances
npm run dev        # Serveur de développement (Vite proxy → API)
npm run build      # Build de production
npm run preview    # Prévisualiser le build
npm run lint       # Linting ESLint
```

## 🔌 Configuration API

En développement, Vite proxie les appels `/api/*` vers le backend local. En production, `vercel.json` redirige `/api/*` vers `https://ronyhair.de5.net/api/*`.

## 📝 Configuration DNS / déploiement

- Frontend déployé sur **Vercel** (build automatique depuis GitHub).
- Domaine : `ronyhair237.de5.net` (A record → Vercel).
- `vercel.json` : rewrite `/api/:path*` → backend + fallback SPA vers `/index.html`.
- Le sitemap `public/sitemap.xml` est indexé dans Google Search Console.

## ⚠️ Notes importantes

- **Sensibilité à la casse** : Linux (Vercel/Render) est case-sensitive. Tous les imports doivent correspondre exactement aux noms de fichiers (Windows ne le détecte pas).
- Le fichier `dist/` n'est pas commité dans ce dépôt (Vercel build depuis les sources).
