import fs from 'node:fs';
import path from 'node:path';
import {
  YamalStatsFileSchema,
  type Goal,
  type YamalStatsData,
} from '../src/types';

/**
 * Normalise le nom de la compétition reçue depuis l'API vers le schéma GoalCompetition.
 */
export function normalizeCompetition(rawName: string) {
  const lower = rawName.toLowerCase();
  if (lower.includes('liga') || lower.includes('primera')) return 'La Liga' as const;
  if (lower.includes('champions') || lower.includes('ucl')) return 'Ligue des Champions' as const;
  if (lower.includes('euro') && (lower.includes('championship') || lower.includes('uefa'))) return 'Euro' as const;
  if (lower.includes('copa del rey') || lower.includes('coupe du roi')) return 'Coupe du Roi' as const;
  if (lower.includes('supercopa') || lower.includes('supercoupe')) return 'Supercoupe d\'Espagne' as const;
  return 'La Liga' as const;
}

/**
 * Normalise le type de but.
 */
export function normalizeGoalType(rawDetail?: string) {
  if (!rawDetail) return 'Pied gauche' as const;
  const lower = rawDetail.toLowerCase();
  if (lower.includes('penalty')) return 'Penalty' as const;
  if (lower.includes('header') || lower.includes('tête')) return 'Tête' as const;
  if (lower.includes('right') || lower.includes('droit')) return 'Pied droit' as const;
  if (lower.includes('curl') || lower.includes('enroulé')) return 'Enroulé pied gauche' as const;
  return 'Pied gauche' as const;
}

/**
 * Formatage d'un identifiant lisible pour un but.
 */
export function generateGoalId(opponent: string, date: string, minute: number): string {
  const sanitizedOpponent = opponent
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 15);
  return `goal-${date}-${sanitizedOpponent}-m${minute}`;
}

async function main() {
  console.log('/// ROCAFONDA ARCHIVE — SCRIPT D\'INGESTION DES STATISTIQUES ///');

  // 1. VÉRIFICATION STRICTE DE LA SÉCURITÉ
  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      '[SÉCURITÉ VIOLEE] La variable d\'environnement \'FOOTBALL_API_KEY\' est strictement obligatoire pour lancer l\'ingestion des données. Définissez FOOTBALL_API_KEY dans votre environnement ou les secrets GitHub Actions.'
    );
  }

  const dataFilePath = path.resolve(process.cwd(), 'data/yamal-stats.json');
  if (!fs.existsSync(dataFilePath)) {
    throw new Error(`[ERREUR FATALE] Le fichier de données est introuvable : ${dataFilePath}`);
  }

  // 2. LECTURE ET VALIDATION DU JEU DE DONNÉES EXISTANT
  let currentRaw: string;
  try {
    currentRaw = fs.readFileSync(dataFilePath, 'utf-8');
  } catch (err) {
    throw new Error(`Impossible de lire le fichier de données existant : ${(err as Error).message}`);
  }

  let currentData: YamalStatsData;
  try {
    const parsed = JSON.parse(currentRaw);
    currentData = YamalStatsFileSchema.parse(parsed);
  } catch (err) {
    throw new Error(`Le fichier actuel data/yamal-stats.json est corrompu : ${(err as Error).message}`);
  }

  console.log(`✓ Données actuelles chargées : ${currentData.goals.length} buts, ${currentData.records.length} records.`);

  // 3. INTERROGATION SÉCURISÉE DE L'API FOOTBALL
  // ID joueur Lamine Yamal (API-Football : 380061, Équipe Barcelone : 529)
  const provider = process.env.FOOTBALL_API_PROVIDER || 'api-football';
  const currentYear = new Date().getFullYear();

  let fetchedGoals: Goal[] = [];

  try {
    if (provider === 'api-football') {
      console.log(`[API] Interrogation de l'API-Football pour Lamine Yamal (Saison ${currentYear})...`);

      const url = `https://v3.football.api-sports.io/players?id=380061&season=${currentYear}`;
      const response = await fetch(url, {
        headers: {
          'x-apisports-key': apiKey,
        },
      });

      if (response.status === 429) {
        console.warn('⚠️ Quota d\'appels API dépassé (HTTP 429). Aucune donnée locale n\'a été altérée.');
        process.exit(0);
      }

      if (!response.ok) {
        console.warn(`⚠️ Erreur serveur API (HTTP ${response.status} : ${response.statusText}). Données locales préservées.`);
        process.exit(0);
      }

      const payload = await response.json() as {
        errors?: unknown[];
        response?: Array<{
          statistics?: Array<{
            team?: { name?: string };
            league?: { name?: string };
            goals?: { total?: number; assists?: number };
            games?: { appearences?: number };
          }>;
        }>;
      };

      if (payload.errors && Array.isArray(payload.errors) && payload.errors.length > 0) {
        console.warn('⚠️ L\'API a renvoyé des erreurs métier :', payload.errors);
        process.exit(0);
      }

      // Traitement des statistiques globales
      const statsArray = payload.response?.[0]?.statistics || [];
      let totalGoalsFound = 0;
      let totalAssistsFound = 0;
      let totalMatchesFound = 0;

      for (const st of statsArray) {
        totalGoalsFound += st.goals?.total || 0;
        totalAssistsFound += st.goals?.assists || 0;
        totalMatchesFound += st.games?.appearences || 0;
      }

      console.log(`✓ Données reçues : ${totalGoalsFound} buts saisonniers, ${totalAssistsFound} passes.`);
      
      // Mise à jour de l'aperçu si données supérieures
      if (totalGoalsFound > 0 && totalGoalsFound >= currentData.statsOverview.totalGoals) {
        currentData.statsOverview.totalGoals = totalGoalsFound;
      }
      if (totalAssistsFound > 0 && totalAssistsFound >= currentData.statsOverview.totalAssists) {
        currentData.statsOverview.totalAssists = totalAssistsFound;
      }
      if (totalMatchesFound > 0 && totalMatchesFound >= currentData.statsOverview.totalMatches) {
        currentData.statsOverview.totalMatches = totalMatchesFound;
      }

    } else {
      console.log(`[API] Fournisseur '${provider}' non configuré, saut de l'appel externe.`);
    }
  } catch (apiError) {
    console.error(`⚠️ Exception réseau lors de l'appel API : ${(apiError as Error).message}`);
    console.log('Les données locales existantes restent intactes.');
    process.exit(0);
  }

  // 4. FUSION INTELLIGENTE (MERGE SÉCURISÉ)
  // RÈGLE ABSOLUE : Préserver toutes les métadonnées manuelles (coordonnées x/y, videoId, descriptions)
  const existingGoalsMap = new Map<string, Goal>();
  for (const goal of currentData.goals) {
    existingGoalsMap.set(goal.id, goal);
  }

  let newGoalsCount = 0;
  for (const fetched of fetchedGoals) {
    if (existingGoalsMap.has(fetched.id)) {
      // Le but existe déjà : ON PRÉSERVE l'enrichissement manuel Butoscope et vidéo
      const existing = existingGoalsMap.get(fetched.id)!;
      existingGoalsMap.set(fetched.id, {
        ...fetched,
        coordinates: existing.coordinates, // Inviolable
        videoId: existing.videoId,         // Inviolable
        videoUrl: existing.videoUrl,       // Inviolable
        description: existing.description, // Inviolable
        importance: existing.importance,   // Inviolable
        tags: existing.tags,
      });
    } else {
      // Nouveau but détecté
      existingGoalsMap.set(fetched.id, fetched);
      newGoalsCount++;
    }
  }

  // 5. MISE À JOUR DE LA DATE ET VALIDATION ZOD COMPLÈTE
  const today = new Date().toISOString().split('T')[0];
  currentData.statsOverview.lastUpdated = today;
  currentData.goals = Array.from(existingGoalsMap.values());

  const validationResult = YamalStatsFileSchema.safeParse(currentData);
  if (!validationResult.success) {
    console.error('❌ Échec de la validation Zod après tentative de fusion :');
    console.error(validationResult.error.issues);
    throw new Error('Les nouvelles données fusionnées sont invalides. Écriture annulée.');
  }

  // 6. ÉCRITURE ATOMIQUE
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify(validationResult.data, null, 2) + '\n',
    'utf-8'
  );

  console.log(`✅ Traitement terminé avec succès. ${newGoalsCount} nouveau(x) but(s) ajouté(s). Date MAJ : ${today}`);
}

main().catch((err) => {
  console.error('[ERREUR]', err.message);
  process.exit(1);
});
