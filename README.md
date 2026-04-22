# PCB Order Platform (PCB-MICOD)

Prototype d'une plateforme de commande de PCB avec upload Gerber, affichage de la taille réelle, et preview 2D/3D.

## Architecture

- `backend/` : API Express pour recevoir les fichiers Gerber et extraire des métadonnées (stockage local).
- `frontend/` : Application React avec preview 2D/3D et intégration Firebase (Auth & Firestore).

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Déploiement

### Backend (Production)
Le backend est configuré pour être déployé (ex: sur Railway ou Render). L'URL de production est :
`https://pcb-micod-backend-production.up.railway.app`

### Frontend (Production)
Le frontend est configuré pour pointer vers l'URL du backend de production via `frontend/.env.production`.

## Utilisation

1. Lance le backend sur `http://localhost:3000`.
2. Lance le frontend sur `http://localhost:5173`.
3. Connectez-vous ou inscrivez-vous pour passer une commande.
