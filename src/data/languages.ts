import { ProgrammingLanguage } from '@/types/devMode';

export const programmingLanguages: ProgrammingLanguage[] = [
  // Web Development
  { id: 'javascript', name: 'JavaScript', icon: '🟨', description: 'The language of the web', difficulty: 'beginner', category: 'web' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', description: 'JavaScript with types', difficulty: 'intermediate', category: 'web' },
  { id: 'html', name: 'HTML', icon: '🧡', description: 'Structure of the web', difficulty: 'beginner', category: 'web' },
  { id: 'css', name: 'CSS', icon: '💙', description: 'Styling the web', difficulty: 'beginner', category: 'web' },
  { id: 'php', name: 'PHP', icon: '🐘', description: 'Server-side scripting', difficulty: 'beginner', category: 'web' },
  
  // Systems Programming
  { id: 'python', name: 'Python', icon: '🐍', description: 'Simple yet powerful', difficulty: 'beginner', category: 'data' },
  { id: 'java', name: 'Java', icon: '☕', description: 'Enterprise powerhouse', difficulty: 'intermediate', category: 'systems' },
  { id: 'csharp', name: 'C#', icon: '💜', description: 'Microsoft ecosystem', difficulty: 'intermediate', category: 'systems' },
  { id: 'cpp', name: 'C++', icon: '⚡', description: 'Performance-critical apps', difficulty: 'advanced', category: 'systems' },
  { id: 'c', name: 'C', icon: '🔧', description: 'The foundation', difficulty: 'advanced', category: 'systems' },
  { id: 'rust', name: 'Rust', icon: '🦀', description: 'Safe systems programming', difficulty: 'advanced', category: 'systems' },
  { id: 'go', name: 'Go', icon: '🐹', description: 'Simple and efficient', difficulty: 'intermediate', category: 'systems' },
  
  // Mobile Development
  { id: 'swift', name: 'Swift', icon: '🍎', description: 'iOS development', difficulty: 'intermediate', category: 'mobile' },
  { id: 'kotlin', name: 'Kotlin', icon: '🤖', description: 'Android development', difficulty: 'intermediate', category: 'mobile' },
  { id: 'dart', name: 'Dart', icon: '🎯', description: 'Flutter apps', difficulty: 'intermediate', category: 'mobile' },
  
  // Data Science & AI
  { id: 'r', name: 'R', icon: '📊', description: 'Statistical computing', difficulty: 'intermediate', category: 'data' },
  { id: 'julia', name: 'Julia', icon: '🔬', description: 'Scientific computing', difficulty: 'advanced', category: 'data' },
  { id: 'sql', name: 'SQL', icon: '🗃️', description: 'Database queries', difficulty: 'beginner', category: 'data' },
  
  // Scripting
  { id: 'ruby', name: 'Ruby', icon: '💎', description: 'Developer happiness', difficulty: 'beginner', category: 'scripting' },
  { id: 'perl', name: 'Perl', icon: '🐪', description: 'Text processing', difficulty: 'intermediate', category: 'scripting' },
  { id: 'bash', name: 'Bash', icon: '🖥️', description: 'Shell scripting', difficulty: 'intermediate', category: 'scripting' },
  { id: 'powershell', name: 'PowerShell', icon: '🪟', description: 'Windows automation', difficulty: 'intermediate', category: 'scripting' },
  { id: 'lua', name: 'Lua', icon: '🌙', description: 'Game scripting', difficulty: 'beginner', category: 'scripting' },
  
  // Functional
  { id: 'haskell', name: 'Haskell', icon: '🎭', description: 'Pure functional', difficulty: 'advanced', category: 'functional' },
  { id: 'scala', name: 'Scala', icon: '🔴', description: 'Functional + OOP', difficulty: 'advanced', category: 'functional' },
  { id: 'elixir', name: 'Elixir', icon: '💧', description: 'Concurrent apps', difficulty: 'intermediate', category: 'functional' },
  { id: 'clojure', name: 'Clojure', icon: '🟢', description: 'Lisp on JVM', difficulty: 'advanced', category: 'functional' },
  { id: 'fsharp', name: 'F#', icon: '🔵', description: 'Functional .NET', difficulty: 'advanced', category: 'functional' },
  { id: 'erlang', name: 'Erlang', icon: '📞', description: 'Telecom systems', difficulty: 'advanced', category: 'functional' },
  
  // Other
  { id: 'assembly', name: 'Assembly', icon: '🔩', description: 'Low-level control', difficulty: 'advanced', category: 'other' },
  { id: 'cobol', name: 'COBOL', icon: '🏦', description: 'Legacy systems', difficulty: 'intermediate', category: 'other' },
  { id: 'fortran', name: 'Fortran', icon: '🧮', description: 'Scientific computing', difficulty: 'advanced', category: 'other' },
  { id: 'lisp', name: 'Lisp', icon: '🌿', description: 'AI pioneer', difficulty: 'advanced', category: 'functional' },
  { id: 'prolog', name: 'Prolog', icon: '🧠', description: 'Logic programming', difficulty: 'advanced', category: 'other' },
  { id: 'matlab', name: 'MATLAB', icon: '📐', description: 'Engineering', difficulty: 'intermediate', category: 'data' },
  { id: 'solidity', name: 'Solidity', icon: '⛓️', description: 'Smart contracts', difficulty: 'advanced', category: 'other' },
  { id: 'zig', name: 'Zig', icon: '⚡', description: 'Modern systems', difficulty: 'advanced', category: 'systems' },
  { id: 'nim', name: 'Nim', icon: '👑', description: 'Efficient elegant', difficulty: 'intermediate', category: 'systems' },
  { id: 'crystal', name: 'Crystal', icon: '💎', description: 'Ruby-like speed', difficulty: 'intermediate', category: 'systems' },
  { id: 'v', name: 'V', icon: '🔹', description: 'Simple fast', difficulty: 'intermediate', category: 'systems' },
];

export const languageCategories = [
  { id: 'web', name: 'Web Development', icon: '🌐' },
  { id: 'systems', name: 'Systems Programming', icon: '⚙️' },
  { id: 'mobile', name: 'Mobile Development', icon: '📱' },
  { id: 'data', name: 'Data Science & AI', icon: '📊' },
  { id: 'scripting', name: 'Scripting', icon: '📜' },
  { id: 'functional', name: 'Functional', icon: 'λ' },
  { id: 'other', name: 'Other', icon: '🔮' },
];
