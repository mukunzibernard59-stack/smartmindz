import { Topic } from '@/types/devMode';

export const getTopicsForLanguage = (languageId: string): Topic[] => {
  // Base curriculum that applies to most languages
  const baseCurriculum: Topic[] = [
    {
      id: 'basics',
      title: 'Fundamentals',
      icon: '📚',
      order: 1,
      lessons: [
        { id: 'intro', title: 'Introduction & Setup', description: 'Get started with the language', order: 1, completed: false, locked: false },
        { id: 'syntax', title: 'Basic Syntax', description: 'Learn the core syntax rules', order: 2, completed: false, locked: true },
        { id: 'output', title: 'Output & Printing', description: 'Display information to users', order: 3, completed: false, locked: true },
        { id: 'comments', title: 'Comments & Documentation', description: 'Document your code', order: 4, completed: false, locked: true },
      ],
    },
    {
      id: 'variables',
      title: 'Variables & Data Types',
      icon: '📦',
      order: 2,
      lessons: [
        { id: 'vars', title: 'Declaring Variables', description: 'Store and manage data', order: 1, completed: false, locked: true },
        { id: 'types', title: 'Data Types', description: 'Strings, numbers, booleans', order: 2, completed: false, locked: true },
        { id: 'type-conversion', title: 'Type Conversion', description: 'Convert between types', order: 3, completed: false, locked: true },
        { id: 'constants', title: 'Constants', description: 'Immutable values', order: 4, completed: false, locked: true },
      ],
    },
    {
      id: 'operators',
      title: 'Operators & Expressions',
      icon: '➕',
      order: 3,
      lessons: [
        { id: 'arithmetic', title: 'Arithmetic Operators', description: 'Math operations', order: 1, completed: false, locked: true },
        { id: 'comparison', title: 'Comparison Operators', description: 'Compare values', order: 2, completed: false, locked: true },
        { id: 'logical', title: 'Logical Operators', description: 'AND, OR, NOT', order: 3, completed: false, locked: true },
        { id: 'assignment', title: 'Assignment Operators', description: 'Assign values', order: 4, completed: false, locked: true },
      ],
    },
    {
      id: 'control-flow',
      title: 'Control Flow',
      icon: '🔀',
      order: 4,
      lessons: [
        { id: 'if-else', title: 'If-Else Statements', description: 'Conditional logic', order: 1, completed: false, locked: true },
        { id: 'switch', title: 'Switch Statements', description: 'Multiple conditions', order: 2, completed: false, locked: true },
        { id: 'ternary', title: 'Ternary Operator', description: 'Shorthand conditions', order: 3, completed: false, locked: true },
      ],
    },
    {
      id: 'loops',
      title: 'Loops & Iteration',
      icon: '🔄',
      order: 5,
      lessons: [
        { id: 'for', title: 'For Loops', description: 'Count-based iteration', order: 1, completed: false, locked: true },
        { id: 'while', title: 'While Loops', description: 'Condition-based iteration', order: 2, completed: false, locked: true },
        { id: 'do-while', title: 'Do-While Loops', description: 'Execute at least once', order: 3, completed: false, locked: true },
        { id: 'break-continue', title: 'Break & Continue', description: 'Control loop flow', order: 4, completed: false, locked: true },
      ],
    },
    {
      id: 'functions',
      title: 'Functions',
      icon: '⚡',
      order: 6,
      lessons: [
        { id: 'define', title: 'Defining Functions', description: 'Create reusable code', order: 1, completed: false, locked: true },
        { id: 'parameters', title: 'Parameters & Arguments', description: 'Pass data to functions', order: 2, completed: false, locked: true },
        { id: 'return', title: 'Return Values', description: 'Get data from functions', order: 3, completed: false, locked: true },
        { id: 'scope', title: 'Scope & Closure', description: 'Variable visibility', order: 4, completed: false, locked: true },
        { id: 'recursion', title: 'Recursion', description: 'Functions calling themselves', order: 5, completed: false, locked: true },
      ],
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      icon: '🗂️',
      order: 7,
      lessons: [
        { id: 'arrays', title: 'Arrays & Lists', description: 'Ordered collections', order: 1, completed: false, locked: true },
        { id: 'objects', title: 'Objects & Dictionaries', description: 'Key-value pairs', order: 2, completed: false, locked: true },
        { id: 'sets', title: 'Sets', description: 'Unique collections', order: 3, completed: false, locked: true },
        { id: 'stacks-queues', title: 'Stacks & Queues', description: 'LIFO and FIFO', order: 4, completed: false, locked: true },
      ],
    },
    {
      id: 'oop',
      title: 'Object-Oriented Programming',
      icon: '🏗️',
      order: 8,
      lessons: [
        { id: 'classes', title: 'Classes & Objects', description: 'Blueprints for objects', order: 1, completed: false, locked: true },
        { id: 'constructors', title: 'Constructors', description: 'Initialize objects', order: 2, completed: false, locked: true },
        { id: 'inheritance', title: 'Inheritance', description: 'Extend classes', order: 3, completed: false, locked: true },
        { id: 'polymorphism', title: 'Polymorphism', description: 'Many forms', order: 4, completed: false, locked: true },
        { id: 'encapsulation', title: 'Encapsulation', description: 'Data hiding', order: 5, completed: false, locked: true },
        { id: 'abstraction', title: 'Abstraction', description: 'Abstract classes & interfaces', order: 6, completed: false, locked: true },
      ],
    },
    {
      id: 'error-handling',
      title: 'Error Handling',
      icon: '🛡️',
      order: 9,
      lessons: [
        { id: 'try-catch', title: 'Try-Catch Blocks', description: 'Handle exceptions', order: 1, completed: false, locked: true },
        { id: 'throwing', title: 'Throwing Errors', description: 'Create custom errors', order: 2, completed: false, locked: true },
        { id: 'debugging', title: 'Debugging Techniques', description: 'Find and fix bugs', order: 3, completed: false, locked: true },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Concepts',
      icon: '🚀',
      order: 10,
      lessons: [
        { id: 'async', title: 'Async Programming', description: 'Handle async operations', order: 1, completed: false, locked: true },
        { id: 'generics', title: 'Generics', description: 'Type-safe containers', order: 2, completed: false, locked: true },
        { id: 'modules', title: 'Modules & Packages', description: 'Organize code', order: 3, completed: false, locked: true },
        { id: 'testing', title: 'Testing', description: 'Write tests', order: 4, completed: false, locked: true },
        { id: 'patterns', title: 'Design Patterns', description: 'Common solutions', order: 5, completed: false, locked: true },
      ],
    },
  ];

  return baseCurriculum;
};

export const challenges = [
  { id: 'first-program', title: 'Hello World', description: 'Write your first program', difficulty: 'easy' as const, xpReward: 50, requirements: ['Print "Hello, World!"'], completed: false },
  { id: 'calculator', title: 'Basic Calculator', description: 'Build a simple calculator', difficulty: 'easy' as const, xpReward: 100, requirements: ['Add two numbers', 'Subtract', 'Multiply', 'Divide'], completed: false },
  { id: 'fizzbuzz', title: 'FizzBuzz Challenge', description: 'The classic coding interview question', difficulty: 'medium' as const, xpReward: 150, requirements: ['Print numbers 1-100', 'Print Fizz for multiples of 3', 'Print Buzz for multiples of 5'], completed: false },
  { id: 'palindrome', title: 'Palindrome Checker', description: 'Check if a string is a palindrome', difficulty: 'medium' as const, xpReward: 200, requirements: ['Accept user input', 'Check both ways', 'Handle edge cases'], completed: false },
  { id: 'todo-app', title: 'Todo Application', description: 'Build a todo list app', difficulty: 'hard' as const, xpReward: 500, requirements: ['Add tasks', 'Remove tasks', 'Mark complete', 'Persist data'], completed: false },
  { id: 'api-integration', title: 'API Integration', description: 'Fetch and display API data', difficulty: 'hard' as const, xpReward: 600, requirements: ['Make HTTP requests', 'Parse JSON', 'Display data', 'Handle errors'], completed: false },
  { id: 'sorting', title: 'Sorting Algorithm', description: 'Implement a sorting algorithm', difficulty: 'expert' as const, xpReward: 800, requirements: ['Implement from scratch', 'Handle edge cases', 'Optimize performance'], completed: false },
];

export const careerPaths = [
  { id: 'frontend', title: 'Frontend Developer', description: 'Build beautiful user interfaces', icon: '🎨', languages: ['html', 'css', 'javascript', 'typescript'], skills: ['React', 'Vue', 'CSS Frameworks'], progress: 0 },
  { id: 'backend', title: 'Backend Developer', description: 'Build server-side applications', icon: '⚙️', languages: ['python', 'java', 'go', 'rust'], skills: ['APIs', 'Databases', 'Security'], progress: 0 },
  { id: 'fullstack', title: 'Full Stack Developer', description: 'Master both frontend and backend', icon: '🌐', languages: ['javascript', 'typescript', 'python'], skills: ['React', 'Node.js', 'Databases'], progress: 0 },
  { id: 'mobile', title: 'Mobile Developer', description: 'Create mobile applications', icon: '📱', languages: ['swift', 'kotlin', 'dart'], skills: ['iOS', 'Android', 'Flutter'], progress: 0 },
  { id: 'data', title: 'Data Scientist', description: 'Analyze and visualize data', icon: '📊', languages: ['python', 'r', 'sql', 'julia'], skills: ['Machine Learning', 'Statistics', 'Visualization'], progress: 0 },
  { id: 'ai', title: 'AI/ML Engineer', description: 'Build intelligent systems', icon: '🤖', languages: ['python', 'cpp', 'julia'], skills: ['Neural Networks', 'NLP', 'Computer Vision'], progress: 0 },
  { id: 'devops', title: 'DevOps Engineer', description: 'Automate and deploy', icon: '🔧', languages: ['bash', 'python', 'go'], skills: ['CI/CD', 'Docker', 'Kubernetes'], progress: 0 },
  { id: 'security', title: 'Cybersecurity Engineer', description: 'Protect systems and data', icon: '🔒', languages: ['python', 'c', 'bash'], skills: ['Penetration Testing', 'Cryptography', 'Security'], progress: 0 },
  { id: 'blockchain', title: 'Blockchain Developer', description: 'Build decentralized apps', icon: '⛓️', languages: ['solidity', 'rust', 'go'], skills: ['Smart Contracts', 'Web3', 'DeFi'], progress: 0 },
  { id: 'gamedev', title: 'Game Developer', description: 'Create video games', icon: '🎮', languages: ['csharp', 'cpp', 'lua'], skills: ['Unity', 'Unreal', 'Graphics'], progress: 0 },
];

export const rankXpThresholds = {
  beginner: 0,
  junior: 500,
  intermediate: 2000,
  advanced: 5000,
  expert: 10000,
  master: 25000,
};
