# Skill : Architecture 100% Statique (SSG) & Performance Maximale

## Objectif
Maintenir une architecture 100 % statique (Static Site Generation), éliminant tout coût d'hébergement, tout goulot d'étranglement serveur, et garantissant une tolérance absolue aux pics de trafic mondiaux.

---

## 1. Principes Fondamentaux du 100 % SSG

- **Zéro Serverless au Runtime** :
  - L'application est intégralement compilée au moment du `astro build`.
  - Le serveur ou CDN ne fait que distribuer des fichiers statiques (HTML, CSS, JS minimal, JSON, images WebP/AVIF).
  - Aucune fonction serverless (`output: 'server'` interdit sauf pré-rendu explicite `prerender = true`), aucune exécution Node.js au moment de la consultation.
- **Zéro Appel API Côté Client** :
  - Le navigateur ne lance aucun appel `fetch()` vers des backends ou API externes pour charger les statistiques ou le contenu de base.
  - Toutes les données nécessaires à une page sont injectées à la compilation dans le HTML ou servies via des fichiers JSON statiques immutables pré-générés.

---

## 2. Robustesse face aux Pics de Trafic & Hébergement Gratuit (0 €)

- **Modèle Vercel Hobby (0 €)** :
  - Les requêtes sont absorbées à 100 % par le cache Edge CDN mondial.
  - Le site supporte des dizaines de milliers d'utilisateurs simultanés sans consommer de quotas serverless ni générer de facturation.
- **Routage Statique** :
  - Utilisation systématique de `getStaticPaths()` pour toutes les routes dynamiques (ex: `/buts/[id]`, `/records/[slug]`).
  - Chaque page dispose d'un fichier HTML physique précalculé dans le dossier `dist/`.

---

## 3. Optimisation des Assets & Core Web Vitals

- **Gestion des Images** :
  - Utilisation obligatoire du composant `<Image />` d'Astro (`astro:assets`).
  - Conversion automatique vers les formats modernes compressés sans perte perceptible (**WebP** ou **AVIF**).
  - Tailles et ratios d'aspect fixés systématiquement pour empêcher tout décalage d'affichage (CLS = 0).
- **Empreinte JavaScript Minimale (Zero-JS by default)** :
  - Astro délivre 0 Ko de JavaScript par défaut pour les pages purement informationnelles.
  - Utilisation des directives d'hydratation partielle (`client:idle`, `client:visible`) uniquement pour les micro-interactions requérant du script (ex: filtre de buts ou onglet interactif).
- **Audit de Performance Continu** :
  - Validation que chaque page pré-rendue atteint un score Lighthouse > 95 sur tous les indicateurs.
