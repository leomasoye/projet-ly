import { z } from 'zod';

export const TrophyTeamSchema = z.enum([
  'FC Barcelone',
  'Espagne',
]);

export const TrophyCategorySchema = z.enum([
  'Collectif',
  'Individuel',
]);

export const TrophySchema = z.object({
  id: z.string().min(1, 'L\'identifiant du trophée est obligatoire'),
  title: z.string().min(1, 'Le titre du trophée est obligatoire'),
  competition: z.string().min(1, 'La compétition est obligatoire'),
  year: z.number().int().min(2022).max(2035, 'Année de trophée invalide'),
  team: TrophyTeamSchema,
  category: TrophyCategorySchema,
  role: z.string().min(5, 'Le rôle ou l\'importance sportive est requis'),
  visual: z.string().min(1, 'Le chemin du visuel SVG ou WebP est obligatoire'),
  highlight: z.string().optional(),
});

export type TrophyTeam = z.infer<typeof TrophyTeamSchema>;
export type TrophyCategory = z.infer<typeof TrophyCategorySchema>;
export type Trophy = z.infer<typeof TrophySchema>;
