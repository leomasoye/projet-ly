import fs from 'node:fs';
import path from 'node:path';
import {
  YamalStatsFileSchema,
  type YamalStatsData,
} from '../src/types';

// Chargement automatique d'un fichier .env local si présent (Node 20+)
if (typeof process.loadEnvFile === 'function' && fs.existsSync(path.resolve(process.cwd(), '.env'))) {
  try {
    process.loadEnvFile();
  } catch (e) {
    // Fichier .env ignoré s'il ne peut être chargé
  }
}

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
  console.log('/// BARÇA STATS ANALYTICS — SCRIPT D\'INGESTION DES STATISTIQUES ///');

  // 1. VÉRIFICATION DE LA CLÉ API
  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      '[SÉCURITÉ] La variable d\'environnement \'FOOTBALL_API_KEY\' est obligatoire pour lancer l\'ingestion des données. Définissez FOOTBALL_API_KEY dans votre fichier .env ou les secrets GitHub Actions.'
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

  console.log(`✓ Données actuelles chargées : ${currentData.goals.length} buts répertoriés, ${currentData.records.length} records.`);

  // 3. INTERROGATION SÉCURISÉE DE L'API FOOTBALL (v3.football.api-sports.io)
  // ID joueur Lamine Yamal : 380061 (FC Barcelone : 529)
  const baseUrl = process.env.FOOTBALL_API_BASE_URL || 'https://v3.football.api-sports.io';
  
  // Headers compatibles avec API-Sports direct et RapidAPI
  const headers: Record<string, string> = {
    'x-apisports-key': apiKey.trim(),
  };
  if (apiKey.trim().length > 35) {
    headers['x-rapidapi-key'] = apiKey.trim();
    headers['x-rapidapi-host'] = 'v3.football.api-sports.io';
  }

  // Saisons actives de la carrière professionnelle de Lamine Yamal (début en 2023)
  const now = new Date();
  const currentSeasonYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  const seasonsToFetch: number[] = [];
  for (let s = 2023; s <= Math.max(2024, currentSeasonYear); s++) {
    seasonsToFetch.push(s);
  }

  console.log(`[API] Interrogation de ${baseUrl} pour Lamine Yamal (ID 380061) sur les saisons [${seasonsToFetch.join(', ')}]...`);

  let careerGoals = 0;
  let careerAssists = 0;
  let careerMatches = 0;
  let apiSuccessCount = 0;

  for (const season of seasonsToFetch) {
    try {
      const url = `${baseUrl}/players?id=380061&season=${season}`;
      console.log(`  → Requête saison ${season}...`);
      
      const response = await fetch(url, { headers });

      if (response.status === 429) {
        console.warn('⚠️ Quota d\'appels API journalier atteint (HTTP 429). Données locales préservées.');
        break;
      }

      if (!response.ok) {
        console.warn(`⚠️ Réponse serveur API (HTTP ${response.status} : ${response.statusText}) pour la saison ${season}.`);
        continue;
      }

      const payload = await response.json() as {
        errors?: Record<string, string> | unknown[];
        response?: Array<{
          player?: { name?: string; firstname?: string; lastname?: string };
          statistics?: Array<{
            team?: { name?: string };
            league?: { name?: string };
            goals?: { total?: number | null; assists?: number | null };
            games?: { appearences?: number | null };
          }>;
        }>;
      };

      if (payload.errors && Object.keys(payload.errors).length > 0) {
        console.warn('⚠️ L\'API a renvoyé des erreurs métier :', payload.errors);
        continue;
      }

      const playerEntry = payload.response?.[0];
      if (playerEntry && Array.isArray(playerEntry.statistics)) {
        apiSuccessCount++;
        for (const st of playerEntry.statistics) {
          careerGoals += st.goals?.total || 0;
          careerAssists += st.goals?.assists || 0;
          careerMatches += st.games?.appearences || 0;
        }
      }
    } catch (seasonErr) {
      console.warn(`⚠️ Erreur réseau lors de la récupération de la saison ${season} : ${(seasonErr as Error).message}`);
    }
  }

  // 4. MISE À JOUR DES STATISTIQUES GLOBALES
  if (apiSuccessCount > 0 && careerGoals > 0) {
    console.log(`✓ Statistiques de carrière cumulées reçues : ${careerGoals} buts, ${careerAssists} passes décisives en ${careerMatches} apparitions.`);
    
    // Mise à jour si supérieur ou égal aux données stockées
    currentData.statsOverview.totalGoals = Math.max(currentData.statsOverview.totalGoals, careerGoals);
    currentData.statsOverview.totalAssists = Math.max(currentData.statsOverview.totalAssists, careerAssists);
    currentData.statsOverview.totalMatches = Math.max(currentData.statsOverview.totalMatches, careerMatches);
  } else {
    console.log('ℹ️ Aucune nouvelle donnée supérieure trouvée ou quota API atteint. Données de référence conservées.');
  }

  // 5. MISE À JOUR DE LA DATE ET VALIDATION ZOD
  const today = new Date().toISOString().split('T')[0];
  currentData.statsOverview.lastUpdated = today;

  const validationResult = YamalStatsFileSchema.safeParse(currentData);
  if (!validationResult.success) {
    console.error('❌ Échec de la validation Zod :');
    console.error(validationResult.error.issues);
    throw new Error('Les nouvelles données fusionnées sont invalides. Écriture annulée.');
  }

  // 6. ÉCRITURE DANS data/yamal-stats.json
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify(validationResult.data, null, 2) + '\n',
    'utf-8'
  );

  console.log(`✅ Synchronisation terminée avec succès. Dernière mise à jour enregistrée : ${today}`);
}

main().catch((err) => {
  console.error('[ERREUR]', err.message);
  process.exit(1);
});
