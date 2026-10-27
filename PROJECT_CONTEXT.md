# PROJECT_CONTEXT.md — Plateforme Lamine Yamal (304)

> **Source unique de vérité** pour l'ensemble du cycle de développement, de design et de gouvernance technique du projet.

---

## 1. Vision Produit & Direction Artistique

- **Concept** : Site éditorial fanzine de football au design **brutaliste urbain**, célébrant l'ascension fulgurante du prodige Lamine Yamal (« *De Rocafonda à l'Europe* »).
- **Anti-Template IA** : 
  - **Bannissement absolu** du style IA générique : dégradés violets/cyan pastel, glassmorphism translucide, cartes flottantes sans âme, ombres douces diffuses.
  - **Esthétique brute & authentique** : textures bitume, découpes franches, grilles asymétriques inspirées des fanzines papier et de la presse sportive underground, contrastes extrêmes, typographies d'impact.
- **Identité Rocafonda « 304 »** :
  - Le code postal `08304` de Rocafonda (Mataró), célébré par Lamine à chaque but avec ses doigts (`3-0-4`), est le fil conducteur iconographique du projet (filigranes, numérotation, marquages techniques, éléments de grille, micro-détails).
- **Palette chromatique identitaire** :
  - **Bitume Profond** (`#0D0E12`) : arrière-plan texturé et dominant.
  - **Blanc Craie** (`#F2F2F0`) : titrages et textes principaux à fort impact.
  - **Bleu Catalan Tranchant** (`#004D98`) : accents identitaires club.
  - **Grenat Catalan Profond** (`#A50044`) : accents contrastants puissants.
  - **Jaune Chasuble / Fluo Street** (`#E2F163`) : surlignages, badges de records, micro-interactions, éléments d'avertissement et accents vifs.
- **Typographie** :
  - Titres et chiffres d'impact : Polices ultra-condensées, massives et expressives (*Bebas Neue*, *Syne* ou équivalent brutaliste).
  - Corps de texte et métriques : Typographies techniques, nettes et lisibles (*Geist*, *Inter*, *JetBrains Mono* pour les stats pures).

---

## 2. Architecture Technique

- **Moteur & Framework** : [Astro](https://astro.build/) en mode **100 % Statique (SSG - Static Site Generation)** avec TypeScript strict (`astro/tsconfigs/strict`).
- **Styling** : Tailwind CSS v4 moderne couplé à des règles CSS sur-mesure pour préserver l'authenticité brutaliste.
- **Validation des données** : [Zod](https://zod.dev/) pour le typage et la validation stricte de tous les schémas de données (buts, trophées, records, matchs, stats avancées).
- **Gestion des données** :
  - Fichiers JSON locaux pré-compilés au moment du build (`src/data/`).
  - Aucun appel API runtime / client : les données sont injectées dans les pages au moment de la compilation SSG.
- **Hébergement & Déploiement** :
  - Hébergement sur Vercel (Plan Hobby, 0 € garanti à vie).
  - Tolérance absolue aux pics de trafic (slashdot effect / pic post-match de Lamine Yamal) grâce au caching CDN statique mondial (Edge Network Vercel).
  - Zéro fonction serverless, zéro base de données dynamique au runtime.

---

## 3. Contraintes de Performance

- **Score Google Lighthouse** : **> 95** sur l'ensemble des 4 piliers (Performance, Accessibilité, Bonnes Pratiques, SEO).
- **Zéro requête API client** : 0 requête fetch externe initiée par le navigateur de l'utilisateur final.
- **Traitement d'images** :
  - Pipeline Astro Assets (`<Image />`) avec conversion systématique vers les formats modernes optimisés (**WebP** / **AVIF**).
  - Dimensions explicites (`width`, `height`) pour éliminer tout Cumulative Layout Shift (CLS = 0).
  - Lazy loading natif et décodage asynchrone (`decoding="async"`).
- **Core Web Vitals** :
  - LCP (Largest Contentful Paint) < 1.2s.
  - FID / INP (Interaction to Next Paint) < 100ms.
  - CLS (Cumulative Layout Shift) = 0.

---

## 4. Règles de Sécurité Obligatoires

- **Confidentialité & Clés API** :
  - **AUCUNE clé API dans le code client** : interdiction formelle d'exposer des variables d'environnement préfixées par `PUBLIC_` pour des services tiers sensibles.
  - Fichiers d'environnement systématiquement ignorés dans Git (`.env*` sauf `.env.example`).
- **Validation Stricte des Schémas (Zod)** :
  - Chaque fichier de données (statistiques, records, vidéos) passe obligatoirement par un validateur Zod au build.
  - Échec immédiat du build (`astro build`) si une donnée est corrompue, mal typée ou incomplète.
- **Sécurisation des Intégrations Multimédia (Vidéos / Embeds)** :
  - Sandboxing strict de toutes les iframes (YouTube, Streamable, etc.) :
    - `sandbox="allow-scripts allow-same-origin allow-presentation"`
    - `loading="lazy"`
    - `referrerpolicy="strict-origin-when-cross-origin"`
  - Interdiction de `set:html` ou `dangerouslySetInnerHTML` sur des flux non assainis.
- **Hygiène Git & Dépendances** :
  - `.gitignore` exhaustif bloquant les artefacts, secrets, tokens et dépendances.
  - Dépendances auditées (`npm audit` régulier, 0 vulnérabilité tolérée).

---

## 5. Gouvernance & Workflow des Tâches

Toute contribution ou étape de code doit se conformer aux trois compétences du projet consignées dans `.agent/skills/` :
1. `design-system.md` : Règle d'or esthétique et respect du fanzine brutaliste 304.
2. `security.md` : Verrous de sécurité, validation Zod et sandboxing.
3. `static-architecture.md` : Respect du paradigme 100% SSG et performance maximale.
