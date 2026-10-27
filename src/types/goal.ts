import { z } from 'zod';

export const CoordinatesSchema = z.object({
  x: z.number().min(0).max(100, 'La coordonnée X (longueur terrain) doit être entre 0 et 100'),
  y: z.number().min(0).max(100, 'La coordonnée Y (largeur terrain) doit être entre 0 et 100'),
});

export const GoalCompetitionSchema = z.enum([
  'La Liga',
  'Ligue des Champions',
  'Euro',
  'Coupe du Roi',
  'Supercoupe d\'Espagne',
  'Éliminatoires Euro',
]);

export const GoalTypeSchema = z.enum([
  'Pied gauche',
  'Enroulé pied gauche',
  'Frappe lointaine',
  'Pied droit',
  'Tête',
  'Penalty',
  'Piqué / Lob',
]);

export const GoalSchema = z.object({
  id: z.string().min(1, 'L\'identifiant du but est obligatoire'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Le format de date doit être AAAA-MM-JJ'),
  competition: GoalCompetitionSchema,
  season: z.string().regex(/^\d{4}-\d{4}$/, 'Format de saison attendu: AAAA-AAAA (ex: 2023-2024)'),
  opponent: z.string().min(1, 'L\'adversaire est obligatoire'),
  homeAway: z.enum(['DOM', 'EXT', 'NEUTRE']),
  minute: z.number().int().min(1).max(130, 'La minute doit être comprise entre 1 et 130'),
  score: z.string().min(3, 'Le score au moment du but est requis (ex: 1-1)'),
  finalScore: z.string().min(3, 'Le score final du match est requis (ex: 2-2)'),
  goalType: GoalTypeSchema,
  assist: z.string().nullable().optional(),
  coordinates: CoordinatesSchema,
  videoId: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, 'Identifiant YouTube valide de 11 caractères requis'),
  videoUrl: z.url(),
  description: z.string().min(10, 'Une description tactique du but est requise'),
  importance: z.enum(['Historique', 'Décisif', 'Spectaculaire', 'Standard']).default('Standard'),
  tags: z.array(z.string()).default([]),
});

export type PitchCoordinates = z.infer<typeof CoordinatesSchema>;
export type GoalCompetition = z.infer<typeof GoalCompetitionSchema>;
export type GoalType = z.infer<typeof GoalTypeSchema>;
export type Goal = z.infer<typeof GoalSchema>;
