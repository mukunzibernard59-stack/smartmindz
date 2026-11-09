export function isPublicArticle(post: { status: string; content: string }): boolean {
  return post.status === 'published' && post.content.trim().length > 0 && !/\[ADD\/VERIFY\s*:/i.test(post.content);
}

export function hasAvailableResources(moduleId: string, resources: Record<string, readonly unknown[]>): boolean {
  return (resources[moduleId]?.length ?? 0) > 0;
}

// Public display rules for library resources (data stays untouched; admin views
// still see everything). A resource is hidden from students when it is a
// placeholder (under the minimum length) or known to be filed under the wrong
// module, so public pages never show empty or misplaced lessons.
export const MIN_PUBLIC_RESOURCE_LENGTH = 100;

const MISPLACED_RESOURCE_TITLE = /CCMDB401.*business\s*plan/i;

export function isPublicResource(resource: { title: string; content_length?: number | null }): boolean {
  if (MISPLACED_RESOURCE_TITLE.test(resource.title)) return false;
  if (typeof resource.content_length === 'number' && resource.content_length < MIN_PUBLIC_RESOURCE_LENGTH) return false;
  return true;
}