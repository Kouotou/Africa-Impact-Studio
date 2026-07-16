// src/lib/get-dictionary.ts

const dictionaries = {
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
};

export type Dictionary = typeof import('../dictionaries/fr.json');

export const getDictionary = async (locale: 'fr' | 'en') => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries['fr']();
};
