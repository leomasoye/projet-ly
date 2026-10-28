# Skill : Direction Artistique & Design System Analytique Barça Moderne

## Objectif
Définir et appliquer sans déviation l'identité visuelle de la plateforme Lamine Yamal : une interface de statistiques sportive moderne, lumineuse, épurée et haut de gamme, inspirée de l'identité du **FC Barcelone** et des standards professionnels (Sofascore, FBref, Transfermarkt moderne).

---

## 1. Principes Fondamentaux de Design

- **Ambiance Lumineuse & Aérée** : Espacements généreux (*whitespace*), structure claire, respiration visuelle entre les blocs de données.
- **Bordures Fines & Précises** : Séparations discrètes de 1px en `#E2E8F0` ou `#CBD5E1`, pas de contours baveux ou d'ombres portées agressives.
- **Fonds Hiérarchisés** :
  - Fond de base / alternance : Gris très clair subtil (`#F8FAFC` ou `#F1F5F9`).
  - Surfaces actives et cartes : Blanc pur (`#FFFFFF`) avec ombres douces et subtiles (`shadow-sm` / `shadow-md`).
- **Zéro Surcharge Visuelle** : Pas de déformations brutales, pas de textures sales ni de typographies criardes.

---

## 2. Palette Chromatique Officielle FC Barcelone

| Rôle | Token | Valeur Hex | Utilisation & Guide |
| :--- | :--- | :--- | :--- |
| **Bleu Profond (Deep Blau)** | `barca-blau` | `#004D98` | Titres principaux, navigation active, bordures d'accent, liens clés |
| **Grenat Catalan (Blaugrana Red)** | `barca-grana` | `#A50044` | Boutons d'action prioritaires, points d'impact Butoscope, badges d'état |
| **Or Discret (Gold Accent)** | `barca-gold` | `#EDBB00` / `#D4AF37` | Trophées majeurs, étoiles de records, distinctions individuelles |
| **Surface Fond** | `surface-page` | `#F8FAFC` | Arrière-plan général aéré et lumineux |
| **Surface Cartes** | `surface-card` | `#FFFFFF` | Conteneurs statistiques, fiches tactiques, lignes de tableau |
| **Titre & Chiffres forts** | `text-primary` | `#0F172A` | Nombres clés, têtes de chapitre, intitulés |
| **Sous-titres & Libellés** | `text-secondary` | `#475569` | Unités, métadonnées, descriptions courtes |
| **Mentions légères** | `text-muted` | `#64748B` | Dates secondaires, coordonnées, labels techniques |
| **Bordures Fines** | `border-subtle` | `#E2E8F0` | Délimitations discrètes de cartes, tableaux et séparateurs |

---

## 3. Typographie Moderne & Lisible

- **Police unique sans-serif** : `Inter` (ou police système moderne sans-serif équivalente).
- **Chiffres Tabulaires** : Application de `font-variant-numeric: tabular-nums` (`tabular-nums` Tailwind) sur toutes les statistiques pour un alignement vertical parfait des données.
- **Hiérarchie Typographique** :
  - **H1 (Hero)** : `font-bold` ou `font-extrabold`, `tracking-tight`, couleur `#0F172A` rehaussée de touches `#004D98`.
  - **H2 / H3 (Titres de section & cartes)** : `font-semibold` ou `font-bold`, lisibilité directe, casse naturelle ou majuscules sobres sans effet d'étirement.
  - **Statistiques & Métriques** : Chiffres nets en bleu Barça (`#004D98`), contrastant avec des libellés grisés (`#475569`).

---

## 4. Règles de Conception des Composants

### A. Section Hero
- Présentation sobre, institutionnelle et statutaire (style portail officiel / fiche Sofascore U21).
- Cartes de statistiques clés en fond blanc (`#FFFFFF`), bordure fine grise (`#E2E8F0`), chiffres géants nets en bleu Barça (`#004D98`) et libellés grisés.
- Intégration sobre de la photo/silhouette officielle du joueur et calcul automatique de l'âge exact en temps réel.

### B. Le Butoscope
- **Terrain de Football** : Vert gazon pastel très doux et épuré (`#F0FDF4` / `#DCFCE7` avec lignes techniques fines) ou schéma analytique minimaliste gris clair / bleu nuit.
- **Points d'impact des buts** : Pastilles nettes en grenat catalan (`#A50044`) bordées d'un anneau blanc pur (`ring-2 ring-white`), cliquables et survolables.
- **Fiche Tactique** : Panneau blanc moderne avec bordure fine, métriques alignées (distance, angle, xG, minute, passeur) et façade vidéo sobre sans iframe intempestive.

### C. Tableaux et Listes de Données
- Tableau de statistiques ultra-lisible, triable et paginé proprement.
- Alternance de lignes subtile : blanc pur (`#FFFFFF`) et gris très clair (`#F8FAFC`).
- Badges de compétitions et de clubs compacts, alignés avec précision.
- Filtres rapides épurés sous forme de pilules modernes (boutons arrondis blancs avec état actif bleu Barça ou grenat).

### D. Vitrine des Trophées
- Cartes minimalistes blanches rehaussées d'une bordure fine dorée (`#EDBB00`) et d'un liseré supérieur élégant.
- Icônes vectorielles nettes et dorées, typographie soignée et badges d'équipe (FC Barcelone / Espagne) immédiatement identifiables.
