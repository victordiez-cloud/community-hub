# CommunityHub

Plateforme communautaire permettant à ses membres de se connecter, partager leurs compétences et organiser des événements.

---

## Fonctionnalités

- **Authentification** — Inscription, connexion et déconnexion avec gestion de session via token
- **Événements** — Création, listing, filtrage (type, prix, catégorie), inscription et messagerie interne
- **Membres Premium** — Accès lifetime à €19,99 via Stripe ou chèque
- **Compétences** — Les membres premium peuvent proposer et consulter des compétences
- **Contacts** — Envoi et acceptation de demandes de connexion
- **Messagerie privée** — Échanges directs entre membres
- **Panel admin** — Gestion des catégories d'événements

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19, React Router DOM 7 |
| UI | React Bootstrap 2, Bootstrap 5 |
| État global | Redux Toolkit 2, React Redux 9 |
| Formulaires | React Hook Form 7 |
| Build | Vite 8 |
| Backend | API REST PHP (externe) |
| Déploiement | Vercel |

---

## Structure du projet

```
src/
├── app/
│   └── store.js              # Configuration Redux
├── components/
│   ├── layout/               # AppLayout, MainNavbar
│   └── skills/               # SkillCard
├── features/                 # Slices Redux
│   ├── auth/
│   ├── contacts/
│   ├── events/
│   ├── messages/
│   ├── payments/
│   └── skills/
├── pages/                    # Une page par route
├── routes/
│   └── ProtectedRoute.jsx    # Guard d'authentification
├── services/
│   └── api.js                # Client API centralisé
└── App.jsx                   # Routing principal
```

---

## Pages & Routes

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Page d'accueil |
| `/login` | Public | Connexion |
| `/register` | Public | Inscription |
| `/contact` | Public | Formulaire de contact |
| `/events` | Public | Liste et création d'événements |
| `/events/:id` | Public | Détail d'un événement |
| `/dashboard` | Connecté | Profil utilisateur |
| `/premium` | Connecté | Souscription premium |
| `/skills` | Premium | Gestion des compétences |
| `/contacts` | Connecté | Contacts et demandes |
| `/messages` | Connecté | Messagerie privée |
| `/categories` | Admin | Gestion des catégories |

---

## Installation & Lancement

### Prérequis

- Node.js >= 18
- npm

### Installation

```bash
git clone <repo-url>
cd communityhub
npm install
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_API_URL=https://qyklv804.webmo.me/communityhub_api
VITE_PROJECT_KEY=your_project_key
```

### Scripts disponibles

```bash
npm run dev       # Serveur de développement (http://localhost:5173)
npm run build     # Build de production → dist/
npm run preview   # Prévisualiser le build de production
npm run lint      # Lancer ESLint
```

---

## Déploiement

Le projet est configuré pour Vercel. Le fichier `vercel.json` redirige toutes les routes vers `index.html` pour le routing côté client :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Pour déployer : connecter le dépôt à Vercel et renseigner les variables d'environnement dans le dashboard.
