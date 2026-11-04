export function isPublicArticle(post: { status: string; content: string }): boolean {
  return post.status === 'published' && post.content.trim().length > 0 && !/\[ADD\/VERIFY\s*:/i.test(post.content);
}

export function hasAvailableResources(moduleId: string, resources: Record<string, readonly unknown[]>): boolean {
  return (resources[moduleId]?.length ?? 0) > 0;
}