# cinemaX — site public

Front de réservation (Vite, React 19, TypeScript, styled-components). Le visuel reprend le site Future Cinema de 2021. API : `VITE_API_URL` (préfixe `/api/v1`).

## Lancer

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:3000
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…
npm install
npm run dev
```

http://localhost:5174 (proxy Vite vers l’API en développement).

Si l’API tourne en local, CORS doit contenir `http://localhost:5174`. L’offre gratuite Render endort l’API : le premier chargement peut afficher « Réveil du serveur… ».

## Scripts

- `npm run dev` / `build` / `preview`
- `npm run typecheck` / `lint` / `test`

## Auth et paiement

Access token en mémoire. Cookie `refresh_token` (`withCredentials`). Le catalogue est public. Le clic sur **Paiement tickets** exige un compte (`/login?redirect=/programme/:id`). Après Stripe, le front appelle `POST /payments/confirm` (pas de webhook).

## Netlify

Le build produit `dist/` (SPA). Fichiers : `netlify.toml`, `public/_redirects`.

1. Pousser le dépôt `cinemaX-web` sur GitHub.
2. [Netlify](https://app.netlify.com) → Add new site → Import from Git → ce repo.
3. Build command : `npm run build` — publish : `dist` — Node : `22`.
4. Variables d’environnement (avant le premier build) :
   - `VITE_API_URL` = `https://cinemax-api-xc50.onrender.com` (sans slash final)
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_…`
5. Sur Render, ajouter l’URL du site (`https://….netlify.app`) dans `CORS_ORIGINS` (virgule, sans slash final).
