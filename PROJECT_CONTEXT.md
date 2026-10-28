# PROJECT_CONTEXT.md — Plateforme Lamine Yamal (304)

> **Source unique de vérité** pour l'ensemble du cycle de développement, de design et de gouvernance technique du projet.

---

## 1. Vision Produit & Direction Artistique

- **Concept** : Plateforme analytique de référence et interface de statistiques moderne, épurée et lumineuse dédiée au prodige Lamine Yamal, inspirée de l'identité institutionnelle du **FC Barcelone**.
- **Philosophie Visuelle (Type Sofascore / FBref moderne / Dashboard analytique)** :
  - **Ambiance** : Lumineuse, claire, aérée, structurée par des bordures fines et un espacement généreux (*whitespace*). Zéro surcharge visuelle ni effets kitsch.
  - **Fonds structurels** : Blanc pur (`#FFFFFF`) pour les cartes et surfaces actives, combiné à un gris très clair subtil (`#F8FAFC` / `#F1F5F9`) pour délimiter harmonieusement les sections de contenu.
- **Palette Chromatique FC Barcelone** :
  - **Bleu Profond (Deep Blau)** (`#004D98`) : Titres principaux, indicateurs majeurs, éléments de navigation actifs et bordures d'accent.
  - **Grenat Catalan (Blaugrana Red)** (`#A50044`) : Boutons d'action, highlights stratégiques, pastilles d'impact et badges d'état.
  - **Or Discret (Gold Accent)** (`#EDBB00` / `#D4AF37`) : Trophées majeurs, distinctions individuelles, étoiles de records et touches de finition premium.
  - **Neutres & Typographiques** :
    - Titres & valeurs : Zinc foncé (`#0F172A`).
    - Libellés & métriques secondaires : Gris ardoise (`#475569` et `#64748B`).
    - Bordures discrètes & séparateurs : Gris technique subtil (`#E2E8F0`).
- **Typographie** :
  - Police unique sans-serif ultra-propre, moderne et lisible : **Inter** pour l'intégralité du site (titres, métriques chiffrées en chiffres tabulaires `tnum`, tableaux, libellés et corps de texte).
  - Bannissement des déformations brutales, des effets de texte agressifs ou des majuscules surchargées.
  - **Hébergement local strict** dans `public/fonts/` (zéro requête externe, RGPD et performance maximale).

---

## 2. Architecture Technique

- **Moteur & Framework** : [Astro](https://astro.build/) en mode **100 % Statique (SSG - Static Site Generation)** avec TypeScript strict (`astro/tsconfigs/strict`).
- **Styling** : Tailwind CSS v4 configuré avec tokens précis dans `tailwind.config.mjs` et `src/styles/global.css`.
- **Validation des données** : [Zod](https://zod.dev/) pour le typage et la validation stricte de tous les schémas de données (buts, trophées, records, matchs, stats avancées).
- **Gestion des données** :
  - Fichier JSON local pré-compilé au moment du build (`data/yamal-stats.json`).
  - Aucun appel API runtime / client : les données sont injectées dans les pages au moment de la compilation SSG.
- **Hébergement & Déploiement** :
  - Hébergement sur Vercel (Plan Hobby, 0 € garanti à vie).
  - Tolérance absolue aux pics de trafic grâce au caching CDN statique mondial (Edge Network Vercel).
  - Zéro fonction serverless, zéro base de données dynamique au runtime.

---

## 3. Contraintes de Performance

- **Score Google Lighthouse** : **> 95** sur l'ensemble des 4 piliers (Performance, Accessibilité, Bonnes Pratiques, SEO).
- **Zéro requête API client** : 0 requête fetch externe initiée par le navigateur de l'utilisateur final.
- **Façade Vidéo Statique** :
  - Aucun chargement d'iframe au chargement initial de la page.
  - Chargement de l'iframe YouTube sandboxée différé exclusivement au clic utilisateur.
- **Traitement d'images & Assets** :
  - Cache HTTP agressif immuable configuré dans `vercel.json` (`Cache-Control: public, max-age=31536000, immutable`).
- **Core Web Vitals** :
  - LCP (Largest Contentful Paint) < 1.0s.
  - FID / INP (Interaction to Next Paint) < 100ms.
  - CLS (Cumulative Layout Shift) = 0.

---

## 4. Règles de Sécurité Obligatoires

- **Confidentialité & Clés API** :
  - **AUCUNE clé API dans le code client** : interdiction formelle d'exposer des variables d'environnement préfixées par `PUBLIC_` pour des services tiers sensibles.
  - `FOOTBALL_API_KEY` est réservée exclusivement aux scripts Node.js côté serveur/CI et injectée via les GitHub Secrets.
- **Validation Stricte des Schémas (Zod)** :
  - Chaque fichier de données passe obligatoirement par un validateur Zod au build (`src/lib/data-validator.ts`).
  - Échec immédiat du build (`astro build`) si une donnée est corrompue, mal typée ou incomplète.
- **En-têtes HTTP de Sécurité (`vercel.json`)** :
  - `Content-Security-Policy` hermétique : scripts et styles locaux, iframes vidéo restreintes à `https://www.youtube-nocookie.com` et `https://www.youtube.com`.
  - `X-Frame-Options: DENY` (anti-clickjacking).
  - `X-Content-Type-Options: nosniff` (anti-MIME-sniffing).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

---

## 5. Gouvernance & Workflow des Tâches

Toute contribution ou étape de code doit se conformer aux trois compétences du projet consignées dans `.agent/skills/` :
1. `design-system.md` : Règle d'or esthétique et respect de l'interface de statistiques moderne Barça.
2. `security.md` : Verrous de sécurité, validation Zod et sandboxing.
3. `static-architecture.md` : Respect du paradigme 100% SSG et performance maximale.

---

## 6. Déploiement Vercel (0 €) & Ingestion Automatisée des Données

### A. Déployer le Projet sur Vercel (Plan Hobby 100% Gratuit)

1. Rendez-vous sur le tableau de bord [Vercel](https://vercel.com/) et connectez-vous avec votre compte GitHub.
2. Cliquez sur **"Add New..." > "Project"**.
3. Sélectionnez le dépôt GitHub `leomasoye/projet-ly`.
4. Configurez le projet :
   - **Framework Preset** : Astro (détecté automatiquement).
   - **Root Directory** : `./` (la racine).
   - **Build Command** : `npm run build` (par défaut).
   - **Output Directory** : `dist` (par défaut).
   - **Environment Variables** : Aucune variable n'est nécessaire sur Vercel ! Le site étant 100% statique (SSG), toutes les données sont déjà pré-compilées dans le build.
5. Cliquez sur **"Deploy"**. En moins de 45 secondes, votre site est en ligne mondialement sur l'Edge Network Vercel.

### B. Déclaration du Secret `FOOTBALL_API_KEY` sur GitHub Actions

Le rafraîchissement des statistiques est automatisé par GitHub Actions ([.github/workflows/update-stats.yml](file:///c:/Users/leoma/Documents/projet%20ly/.github/workflows/update-stats.yml)) :
1. Accédez à votre dépôt GitHub : `https://github.com/leomasoye/projet-ly`.
2. Allez dans **Settings > Secrets and variables > Actions**.
3. Cliquez sur **"New repository secret"**.
4. Définissez :
   - **Name** : `FOOTBALL_API_KEY`
   - **Secret** : Votre clé API (obtenue sur API-Football / RapidAPI ou Football-Data.org).
5. Cliquez sur **"Add secret"**.

> **Fonctionnement du pipeline :**
> - Chaque lundi à 04h00 UTC (ou sur déclenchement manuel via l'onglet *Actions* > *Run workflow*), GitHub Actions exécute `scripts/fetch-stats.ts`.
> - Si de nouveaux buts ou matchs sont détectés, ils sont validés via Zod et fusionnés sans altérer les coordonnées tactiques existantes du Butoscope.
> - Un commit automatisé est poussé sur la branche `main`.
> - Vercel détecte automatiquement le nouveau commit et déclenche le re-build statique sans aucune intervention humaine.

### C. Personnalisation du Sous-Domaine `.vercel.app` ou Domaine Propre

Par défaut, Vercel attribue une URL du type `projet-ly.vercel.app`. Pour la personnaliser :
1. Sur le tableau de bord Vercel, accédez à votre projet **projet-ly**.
2. Allez dans **Settings > Domains**.
3. Pour modifier le sous-domaine `.vercel.app` :
   - Cliquez sur **"Edit"** en face du domaine actuel.
   - Saisissez le nom souhaité (ex: `yamal304.vercel.app`, `lamine-yamal-304.vercel.app`).
   - Cliquez sur **"Save"**. Le changement est immédiat et le certificat SSL HTTPS est automatiquement renouvelé.
4. Pour ajouter un nom de domaine personnalisé (ex: `lamineyamal304.com`) :
   - Entrez votre domaine dans le champ et suivez les indications DNS (enregistrements CNAME ou A).
