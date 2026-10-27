/**
 * Calcule l'âge exact actuel d'une personne à partir de sa date de naissance (AAAA-MM-JJ).
 */
export function calculateCurrentAge(birthDateStr: string = '2007-07-13'): {
  years: number;
  months: number;
  days: number;
  formatted: string;
} {
  const [year, month, day] = birthDateStr.split('-').map(Number);
  const birth = new Date(year, month - 1, day);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Nombre de jours dans le mois précédent
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    formatted: `${years} ans, ${months > 0 ? `${months} mois et ` : ''}${days} jours`,
  };
}

/**
 * Formate une date au format français standard (ex: 8 octobre 2023).
 */
export function formatDateFr(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
