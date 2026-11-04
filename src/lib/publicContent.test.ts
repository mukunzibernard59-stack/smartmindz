import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { hasAvailableResources, isPublicArticle } from './publicContent';

describe('public content availability', () => {
  test('unfinished articles never become public even with published status', () => {
    assert.equal(isPublicArticle({ status: 'published', content: 'Advice [ADD/VERIFY: official requirements]' }), false);
    assert.equal(isPublicArticle({ status: 'published', content: 'A complete study lesson.' }), true);
  });
  test('draft articles remain private', () => {
    assert.equal(isPublicArticle({ status: 'draft', content: 'A complete study lesson.' }), false);
  });
  test('modules without notes stay out of public browsing', () => {
    assert.equal(hasAvailableResources('empty', { empty: [] }), false);
    assert.equal(hasAvailableResources('missing', {}), false);
    assert.equal(hasAvailableResources('ready', { ready: [{ id: 'note' }] }), true);
  });
});