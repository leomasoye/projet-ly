import { z } from 'zod';
import { GoalSchema } from './goal';
import { TrophySchema } from './trophy';
import { RecordSchema } from './record';

export * from './goal';
export * from './trophy';
export * from './record';

export const PlayerProfileSchema = z.object({
  fullName: z.string().min(1),
  shortName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthPlace: z.string().min(1),
  neighborhood: z.string().min(1),
  postalCodeSign: z.string().min(1),
  currentClub: z.string().min(1),
  jerseyNumber: z.number().int().positive(),
  dominantFoot: z.string().min(1),
  position: z.string().min(1),
});

export const StatsOverviewSchema = z.object({
  totalGoals: z.number().int().nonnegative(),
  totalAssists: z.number().int().nonnegative(),
  totalMatches: z.number().int().nonnegative(),
  totalTrophies: z.number().int().nonnegative(),
  totalRecords: z.number().int().nonnegative(),
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const YamalStatsFileSchema = z.object({
  player: PlayerProfileSchema,
  statsOverview: StatsOverviewSchema,
  goals: z.array(GoalSchema).min(10, 'Le jeu de données doit comporter au moins 10 buts documentés'),
  trophies: z.array(TrophySchema).min(1, 'Au moins un trophée majeur doit être présent'),
  records: z.array(RecordSchema).min(1, 'Au moins un record de précocité doit être présent'),
});

export type PlayerProfile = z.infer<typeof PlayerProfileSchema>;
export type StatsOverview = z.infer<typeof StatsOverviewSchema>;
export type YamalStatsData = z.infer<typeof YamalStatsFileSchema>;
