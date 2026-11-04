import { describe, expect, test } from 'bun:test';
import { hasAvailableResources, isPublicArticle } from './publicContent';

describe('public content availability', () => {
  test('unfinished articles never become public even with published status', () => {
    expect(isPublicArticle({ status: 'published', content: 'Advice [ADD/VERIFY: official requirements]' })).toBe(false);
    expect(isPublicArticle({ status: 'published', content: 'A complete study lesson.' })).toBe(true);
  });
  test('draft articles remain private', () => {
    expect(isPublicArticle({ status: 'draft', content: 'A complete study lesson.' })).toBe(false);
  });
  test('modules without notes stay out of public browsing', () => {
    expect(hasAvailableResources('empty', { empty: [] })).toBe(false);
    expect(hasAvailableResources('missing', {})).toBe(false);
    expect(hasAvailableResources('ready', { ready: [{ id: 'note' }] })).toBe(true);
  });
});