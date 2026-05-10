import en from './en';
import fr from './fr';

const dictionaries = {
	en,
	fr
};

export type Translation_Key = keyof typeof en;

let current_language: keyof typeof dictionaries = 'en';

export function Set_Language(lang: keyof typeof dictionaries) {
	current_language = lang;
}

export function T(key: Translation_Key): string {
	return dictionaries[current_language][key];
}