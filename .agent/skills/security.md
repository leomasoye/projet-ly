# Skill : Règles de Sécurité & Intégrité des Données

## Objectif
Garantir une surface d'attaque nulle, l'inviolabilité des secrets, l'absence de faille XSS et l'intégrité typée de toutes les données du projet.

---

## 1. Zéro Clé API Côté Client (Zero Client-Side Secrets)

- **Principe** : Aucune donnée sensible ou clé d'accès à un service tiers ne doit transiter par le code exécuté sur le navigateur.
- **Règle Astro** :
  - **Interdiction formelle** de créer des variables d'environnement préfixées par `PUBLIC_` contenant des tokens privés, des clés de providers ou des secrets d'infrastructure.
  - Seules des variables non secrètes (ex: URL du site en production) peuvent être préfixées par `PUBLIC_` si strictement nécessaire.
- **Fichiers `.env`** :
  - Tous les fichiers `.env`, `.env.local`, `.env.*` doivent être exclus du contrôle de version.
  - Seul un fichier modèle documenté `.env.example` sans aucune valeur réelle peut être commité.

---

## 2. Validation Stricte des Données avec Zod (No Untyped JSON)

- **Principe** : Aucun fichier JSON ou flux de données ne peut être consommé directement sans passer par un schéma Zod exhaustif.
- **Mise en œuvre** :
  - Chaque entité de données (`Goal`, `Trophy`, `Record`, `MatchStat`, `VideoClip`) dispose d'un schéma Zod dédié dans `src/schemas/` ou via les Content Collections d'Astro.
  - La validation est effectuée à la compilation (`parse` ou `safeParse`). Si une donnée est invalide ou corrompue, le build doit s'interrompre immédiatement avec un message d'erreur explicite.
  - Exemple de structure type :
    ```typescript
    import { z } from 'zod';

    export const GoalSchema = z.object({
      id: z.string().min(1),
      opponent: z.string().min(1),
      competition: z.string().min(1),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      minute: z.number().int().positive(),
      description: z.string(),
      videoUrl: z.string().url().optional(),
      tags: z.array(z.string()),
    });
    ```

---

## 3. Sécurisation des Intégrations Vidéo & Protection XSS

- **Sandboxing d'iframes obligatoire** :
  Toute intégration vidéo externe (YouTube, Streamable, clips officiels) doit intégrer des attributs de sandboxing restrictifs :
  ```html
  <iframe
    src="URL_VALIDEE"
    title="Lamine Yamal Goal Highlight"
    sandbox="allow-scripts allow-same-origin allow-presentation"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
    class="w-full aspect-video border border-[#2A2D35]"
  ></iframe>
  ```
- **Proscription du HTML Brut Non Assaini** :
  - Interdiction d'utiliser `set:html` (Astro) ou `dangerouslySetInnerHTML` sur des chaînes de caractères issues de sources externes non stérilisées.
  - Utilisation de composants Astro typés avec échappement natif automatique pour tout texte ou contenu dynamique.

---

## 4. Hygiène de Configuration & Git

- **Garde-fous `.gitignore`** :
  Vérification continue que les dossiers critiques (`node_modules/`, `dist/`, `.astro/`, `.vercel/`, `.env*`, `*.local`, `tokens*`) ne sont jamais indexés dans l'historique Git.
- **Audit de dépendances** :
  Toute nouvelle dépendance ajoutée doit être inspectée pour prévenir les vulnérabilités de la chaîne d'approvisionnement (`npm audit`).
