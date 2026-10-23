/**
 * Security utilities for input sanitization and validation
 * Prevents XSS, prompt injection, and script injection attacks
 */

// HTML entity encoding to prevent XSS
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return text.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

// Remove potential script injection patterns
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, 'data-blocked:');
  
  // Remove potential prompt injection patterns for AI
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /disregard all prior/gi,
    /forget everything/gi,
    /new instructions:/gi,
    /system prompt:/gi,
    /override:/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<<SYS>>/gi,
    /<\/SYS>>/gi,
  ];
  
  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[filtered]');
  });
  
  return sanitized;
}

// Validate and sanitize file names
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') return 'file';
  
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '').replace(/[\/\\]/g, '');
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop() || '';
    const name = sanitized.substring(0, 250 - ext.length);
    sanitized = `${name}.${ext}`;
  }
  
  return sanitized || 'file';
}

// Validate file type based on MIME and extension
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();
  
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return extension === type.substring(1);
    }
    if (type.includes('*')) {
      const [mainType] = type.split('/');
      return mimeType.startsWith(mainType);
    }
    return mimeType === type;
  });
}

// Validate file size
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

// Mask email for privacy
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2 
    ? `${local[0]}${'*'.repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}`
    : '*'.repeat(local.length);
  
  const [domainName, ...rest] = domain.split('.');
  const maskedDomain = domainName.length > 2
    ? `${domainName[0]}${'*'.repeat(Math.min(domainName.length - 2, 3))}${domainName[domainName.length - 1]}`
    : '*'.repeat(domainName.length);
  
  return `${maskedLocal}@${maskedDomain}.${rest.join('.')}`;
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters');
  }
  
  if (password.length >= 12) score += 1;
  
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }
  
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }
  
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }
  
  // Check for common patterns
  const commonPatterns = [
    /^123/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /(.)\1{2,}/,
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns');
  }
  
  return {
    isValid: score >= 4 && password.length >= 8,
    score: Math.min(score, 6),
    feedback,
  };
}

// Rate limiting helper (client-side tracking)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxAttempts) {
    return false;
  }
  
  entry.count += 1;
  return true;
}

// Clean sensitive data from error messages
export function sanitizeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  
  // Remove potential sensitive data patterns
  let sanitized = message
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]')
    .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[card]')
    .replace(/password[=:]\s*\S+/gi, 'password=[hidden]')
    .replace(/token[=:]\s*\S+/gi, 'token=[hidden]')
    .replace(/key[=:]\s*\S+/gi, 'key=[hidden]')
    .replace(/secret[=:]\s*\S+/gi, 'secret=[hidden]');
  
  return sanitized;
}
