import { describe, it, expect } from 'vitest';
import { contactIsEmpty } from './Contact';

describe('contactIsEmpty', () => {
  describe('empty detection', () => {
    it('returns true when all fields are undefined', () => {
      const contact = {};
      expect(contactIsEmpty(contact)).toBe(true);
    });

    it('returns true when all fields are empty strings', () => {
      const contact = {
        name: '',
        description: '',
        privateCode: '',
        contactPerson: '',
        phone: '',
        email: '',
        url: '',
        furtherDetails: '',
      };
      expect(contactIsEmpty(contact)).toBe(true);
    });
  });

  describe('non-empty detection', () => {
    it('returns false when name is set', () => {
      const contact = { name: 'John Doe' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when description is set', () => {
      const contact = { description: 'Contact description' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when privateCode is set', () => {
      const contact = { privateCode: 'ABC123' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when contactPerson is set', () => {
      const contact = { contactPerson: 'Jane Smith' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when phone is set', () => {
      const contact = { phone: '+47 123 45 678' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when email is set', () => {
      const contact = { email: 'contact@example.com' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when url is set', () => {
      const contact = { url: 'https://example.com' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when furtherDetails is set', () => {
      const contact = { furtherDetails: 'Additional info' };
      expect(contactIsEmpty(contact)).toBe(false);
    });

    it('returns false when multiple fields are set', () => {
      const contact = {
        name: 'John Doe',
        phone: '+47 123 45 678',
        email: 'john@example.com',
      };
      expect(contactIsEmpty(contact)).toBe(false);
    });
  });
});
