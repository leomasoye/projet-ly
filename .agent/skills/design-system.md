# Skill : Direction Artistique & Design System Brutaliste Urbain (304)

## Objectif
Définir et appliquer sans déviation l'identité visuelle du projet Lamine Yamal : un fanzine de football brutaliste urbain, ancré dans l'authenticité de Rocafonda et du football de rue catalan.

---

## 1. Interdictions Strictes (Anti-Template IA)

- **ZÉRO Glassmorphism** : Aucun fond flouté en verre dépoli (`backdrop-blur` avec transparence laiteuse).
- **ZÉRO Dégradés Pastel Génériques** : Interdiction absolue des gradients pourpre/rose/cyan façon landing page SaaS ou template IA générique.
- **ZÉRO Ombres Diffuses Molles** : Pas de `box-shadow` floues type `shadow-2xl` sans découpe nette.
- **ZÉRO Bords Excessivement Arrondis** : Pas d'éléments en `rounded-3xl` ou `rounded-full` sur les cartes principales ; privilégier les angles vifs (`rounded-none` ou `rounded-xs`/`rounded-sm` maximal) pour accentuer la rudesse éditoriale.

---

## 2. Palette Chromatique Identitaire

| Token | Teinte / Hex | Rôle & Usage |
| :--- | :--- | :--- |
| **Bitume** | `#0D0E12` | Arrière-plan structurel principal, sombre, brut et texturé |
| **Craie** | `#F2F2F0` | Titres majeurs, typographies à fort contraste, blanc cassé d'affiche |
| **Bleu Catalan** | `#004D98` | Délimitations tranchantes, rubans graphiques, badges |
| **Grenat Catalan** | `#A50044` | Contrastes puissants, sections chaudes, accents club |
| **Jaune Chasuble** | `#E2F163` | Surlignages fluo, micro-détails, stats clés, marqueurs d'impact |
| **Gris Asphalte** | `#1C1E24` | Surfaces de conteneurs, encadrés techniques, séparateurs secondaires |
| **Bordure Bitume** | `#2A2D35` | Lignes de grille nettes de 1px ou 2px |

---

## 3. Typographies & Hiérarchie

- **Titres & Numérotations de choc** :
  - Familles : *Bebas Neue*, *Syne* ou polices ultra-condensées sans-serif majuscules.
  - Caractéristiques : `uppercase`, `tracking-tight`, interlettrage dense, graisse `font-black` ou `font-bold`.
- **Corps de texte & Données statistiques** :
  - Familles : *Geist*, *Inter*, *JetBrains Mono* (pour les métriques, minutes et coordonnées).
  - Caractéristiques : lisibilité maximale, contraste franc avec le fond bitume.

---

## 4. Motif Identitaire « 304 » (Rocafonda)

Le nombre **304** (derniers chiffres du code postal 08304 de Rocafonda à Mataró, symbole du geste de célébration de Lamine Yamal) doit être incorporé systématiquement :
- En filigrane vectoriel géant à faible opacité (ex. `opacity-5` à `opacity-10`) dans les arrière-plans de sections.
- En marquage technique de bord de page ou tampon « STAMP 304 / MATARÓ ».
- Dans les numérotations d'items, de cartes de buts et d'indices de records.
- Dans les séparateurs de sections (ex: `/// 304 ///`).

---

## 5. Composants Graphiques Clés

- **Cartes Brutalistes** :
  - Bordures nettes de 1px ou 2px (`border border-[#2A2D35]`).
  - Ombres portées dures décalées si nécessaire (`shadow-[4px_4px_0px_0px_#E2F163]` ou `shadow-[3px_3px_0px_0px_#004D98]`).
  - Badges à effet "étiquette industrielle" ou "billet de match vintage".
- **Boutons & Éléments Interactifs** :
  - Hover dynamique avec inversion de contraste franche (ex: fond passant instantanément au jaune `#E2F163` avec texte `#0D0E12`).
  - Effets de glitch ou de translation rigide (offset de 2px).
