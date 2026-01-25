import { describe, it, expect } from 'vitest';
import { getTranslation } from '../translations';

describe('Translations', () => {
    it('should return English translation by default', () => {
        expect(getTranslation('appName', 'en')).toBe('Pocket Helper');
    });

    it('should return Arabic translation', () => {
        expect(getTranslation('appName', 'ar')).toBe('مساعد الجيب');
    });

    it('should fallback to English if key not found', () => {
        expect(getTranslation('nonExistentKey', 'ar')).toBe('nonExistentKey');
    });

    it('should handle RTL languages correctly', () => {
        // This is more of a logic check for the app, but here we just check strings
        expect(getTranslation('sendSos', 'ur')).toBe('SOS بھیجیں');
    });
});
