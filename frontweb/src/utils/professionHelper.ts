// src/utils/professionHelper.ts
import { professions } from '../data/professions';

export const getProfessionTheme = (profession: string) => {
  const professionEntry = professions.find((p) => p.profession === profession);
  return professionEntry ? professionEntry.theme : 'no_theme';
};
