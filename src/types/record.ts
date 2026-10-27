import { z } from 'zod';

export const ExactAgeSchema = z.object({
  years: z.number().int().min(14).max(25, 'Nombre d\'années invalide'),
  days: z.number().int().min(0).max(365, 'Nombre de jours invalide'),
});

export const RecordStatusSchema = z.enum([
  'détenu',
  'égalé',
]);

export const RecordSchema = z.object({
  id: z.string().min(1, 'L\'identifiant du record est obligatoire'),
  title: z.string().min(5, 'L\'intitulé du record est obligatoire'),
  competition: z.string().min(1, 'La compétition est obligatoire'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date requis: AAAA-MM-JJ'),
  exactAge: ExactAgeSchema,
  status: RecordStatusSchema,
  matchContext: z.string().min(3, 'Le contexte du match est obligatoire'),
  previousHolder: z.string().nullable().optional(),
  description: z.string().optional(),
});

export type ExactAge = z.infer<typeof ExactAgeSchema>;
export type RecordStatus = z.infer<typeof RecordStatusSchema>;
export type Record = z.infer<typeof RecordSchema>;
