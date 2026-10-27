import fs from 'node:fs';
import path from 'node:path';
import {
  YamalStatsFileSchema,
  type YamalStatsData,
  type Goal,
  type Trophy,
  type Record,
  type PlayerProfile,
  type StatsOverview,
} from '../types';

let cachedStats: YamalStatsData | null = null;

/**
 * Valide et charge les statistiques complètes de Lamine Yamal depuis data/yamal-stats.json.
 * En cas d'erreur de schéma ou de données corrompues, le build est interrompu immédiatement.
 */
export function getValidatedYamalStats(): YamalStatsData {
  if (cachedStats) {
    return cachedStats;
  }

  const filePath = path.resolve(process.cwd(), 'data/yamal-stats.json');

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[FATAL - BUILD SSG] Fichier de données introuvable : ${filePath}. Vérifiez l'existence de data/yamal-stats.json.`
    );
  }

  let rawContent: string;
  try {
    rawContent = fs.readFileSync(filePath, 'utf-8');
  } catch (readError) {
    throw new Error(
      `[FATAL - BUILD SSG] Impossible de lire le fichier ${filePath} : ${(readError as Error).message}`
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawContent);
  } catch (jsonError) {
    throw new Error(
      `[FATAL - BUILD SSG] Syntaxe JSON invalide dans ${filePath} : ${(jsonError as Error).message}`
    );
  }

  const result = YamalStatsFileSchema.safeParse(parsedJson);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => `  - Chemin [${issue.path.join('.')}]: ${issue.message}`)
      .join('\n');

    const formattedError = `
================================================================================
❌ ÉCHEC DE VALIDATION DES DONNÉES (ZOD SCHEMA ERROR)
Le fichier 'data/yamal-stats.json' contient des données non conformes.
Le build est interrompu pour empêcher le déploiement d'un site instable ou cassé.
Détails des anomalies détectées :
${errorMessages}
================================================================================
`;
    console.error(formattedError);
    throw new Error(`[DATA VALIDATION FAILED] ${result.error.issues.length} erreur(s) de schéma détectée(s).`);
  }

  cachedStats = result.data;
  return cachedStats;
}

/**
 * Retourne la liste validée de tous les buts documentés.
 */
export function getValidatedGoals(): Goal[] {
  return getValidatedYamalStats().goals;
}

/**
 * Recherche un but validé par son identifiant unique.
 */
export function getGoalById(id: string): Goal | undefined {
  return getValidatedGoals().find((goal) => goal.id === id);
}

/**
 * Retourne la liste validée de tous les trophées.
 */
export function getValidatedTrophies(): Trophy[] {
  return getValidatedYamalStats().trophies;
}

/**
 * Retourne la liste validée de tous les records de précocité.
 */
export function getValidatedRecords(): Record[] {
  return getValidatedYamalStats().records;
}

/**
 * Retourne le profil et métadonnées du joueur.
 */
export function getPlayerProfile(): PlayerProfile {
  return getValidatedYamalStats().player;
}

/**
 * Retourne le récapitulatif global des statistiques.
 */
export function getStatsOverview(): StatsOverview {
  return getValidatedYamalStats().statsOverview;
}
