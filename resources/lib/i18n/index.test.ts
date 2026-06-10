import { describe, expect, it } from 'vitest';
import { Set_Language, T, Translate_Or_Value } from './index';

describe('i18n utilities', () => {
	it('returns French translations by default', () => {
		Set_Language('fr');
		expect(T('map')).toBe('Carte interactive');
	});

	it('switches to English translations', () => {
		Set_Language('en');
		expect(T('map')).toBe('Interactive Map');
	});

	it('falls back to the raw key when no translation exists', () => {
		Set_Language('fr');
		expect(Translate_Or_Value('missing_key')).toBe('missing_key');
	});
});
