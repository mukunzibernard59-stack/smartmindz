 // Lesson content with notes and starter code for each lesson
 
 export interface LessonContent {
   lessonId: string;
   title: string;
   notes: string;
   keyPoints: string[];
   starterCode: string;
   expectedOutput?: string;
   tips?: string[];
  hasPractice?: boolean;
 }
 
 export const getLessonContent = (languageId: string, lessonId: string): LessonContent => {
   const content = lessonContents[languageId]?.[lessonId] || getDefaultContent(languageId, lessonId);
   return content;
 };
 
 const getDefaultContent = (languageId: string, lessonId: string): LessonContent => {
   // Generate default content based on lesson ID
   const lessonTitles: Record<string, string> = {
     intro: 'Introduction & Setup',
     syntax: 'Basic Syntax',
     output: 'Output & Printing',
     comments: 'Comments & Documentation',
     vars: 'Declaring Variables',
     types: 'Data Types',
     'type-conversion': 'Type Conversion',
     constants: 'Constants',
     arithmetic: 'Arithmetic Operators',
     comparison: 'Comparison Operators',
     logical: 'Logical Operators',
     assignment: 'Assignment Operators',
     'if-else': 'If-Else Statements',
     switch: 'Switch Statements',
     ternary: 'Ternary Operator',
     for: 'For Loops',
     while: 'While Loops',
     'do-while': 'Do-While Loops',
     'break-continue': 'Break & Continue',
     define: 'Defining Functions',
     parameters: 'Parameters & Arguments',
     return: 'Return Values',
     scope: 'Scope & Closure',
     recursion: 'Recursion',
     arrays: 'Arrays & Lists',
     objects: 'Objects & Dictionaries',
     sets: 'Sets',
     'stacks-queues': 'Stacks & Queues',
     classes: 'Classes & Objects',
     constructors: 'Constructors',
     inheritance: 'Inheritance',
     polymorphism: 'Polymorphism',
     encapsulation: 'Encapsulation',
     abstraction: 'Abstraction',
     'try-catch': 'Try-Catch Blocks',
     throwing: 'Throwing Errors',
     debugging: 'Debugging Techniques',
     async: 'Async Programming',
     generics: 'Generics',
     modules: 'Modules & Packages',
     testing: 'Testing',
     patterns: 'Design Patterns',
   };
 
   return {
     lessonId,
     title: lessonTitles[lessonId] || 'Lesson',
     notes: `Welcome to this lesson on ${lessonTitles[lessonId] || lessonId}. This lesson will help you understand the core concepts and provide hands-on practice.`,
     keyPoints: [
       'Understand the basic concepts',
       'Practice with code examples',
       'Apply what you learned',
     ],
     starterCode: getStarterCodeForLesson(languageId, lessonId),
     tips: ['Take your time to understand each concept', 'Try modifying the code to see different results'],
    hasPractice: lessonId !== 'intro',
   };
 };
 
 const getStarterCodeForLesson = (languageId: string, lessonId: string): string => {
   const starters: Record<string, Record<string, string>> = {
     javascript: {
       intro: '// Welcome to JavaScript!\n// Let\'s write your first program\nconsole.log("Hello, World!");',
       syntax: '// JavaScript Syntax Basics\n// Statements end with semicolons (optional but recommended)\nlet message = "Learning JavaScript";\nconsole.log(message);',
       output: '// Printing output in JavaScript\nconsole.log("This is a message");\nconsole.log("Number:", 42);\nconsole.log("Boolean:", true);',
       comments: '// This is a single-line comment\n\n/* This is a\n   multi-line comment */\n\n/**\n * This is a documentation comment\n * @param {string} name - The name to greet\n */\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("Developer");',
       vars: '// Variables in JavaScript\nlet name = "Alice";      // Can be reassigned\nconst age = 25;          // Cannot be reassigned\nvar city = "New York";   // Old way (avoid using)\n\nconsole.log("Name:", name);\nconsole.log("Age:", age);\nconsole.log("City:", city);',
       types: '// Data Types in JavaScript\nlet str = "Hello";           // String\nlet num = 42;                // Number\nlet decimal = 3.14;          // Number (no separate float)\nlet bool = true;             // Boolean\nlet nothing = null;          // Null\nlet notDefined;              // Undefined\nlet arr = [1, 2, 3];         // Array\nlet obj = { name: "John" };  // Object\n\nconsole.log("Type of str:", typeof str);\nconsole.log("Type of num:", typeof num);\nconsole.log("Type of bool:", typeof bool);',
       arithmetic: '// Arithmetic Operators\nlet a = 10;\nlet b = 3;\n\nconsole.log("Addition:", a + b);      // 13\nconsole.log("Subtraction:", a - b);   // 7\nconsole.log("Multiplication:", a * b); // 30\nconsole.log("Division:", a / b);      // 3.333...\nconsole.log("Modulus:", a % b);       // 1\nconsole.log("Exponent:", a ** b);     // 1000',
       comparison: '// Comparison Operators\nlet x = 5;\nlet y = "5";\n\nconsole.log("x == y:", x == y);   // true (loose equality)\nconsole.log("x === y:", x === y); // false (strict equality)\nconsole.log("x != y:", x != y);   // false\nconsole.log("x > 3:", x > 3);     // true\nconsole.log("x <= 5:", x <= 5);   // true',
       logical: '// Logical Operators\nlet a = true;\nlet b = false;\n\nconsole.log("AND (&&):", a && b);  // false\nconsole.log("OR (||):", a || b);   // true\nconsole.log("NOT (!):", !a);       // false\n\n// Practical example\nlet age = 20;\nlet hasLicense = true;\n\nif (age >= 18 && hasLicense) {\n  console.log("You can drive!");\n}',
       'if-else': '// If-Else Statements\nlet score = 75;\n\nif (score >= 90) {\n  console.log("Grade: A");\n} else if (score >= 80) {\n  console.log("Grade: B");\n} else if (score >= 70) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}\n\n// Try changing the score!',
       switch: '// Switch Statement\nlet day = "Monday";\n\nswitch (day) {\n  case "Monday":\n    console.log("Start of the week!");\n    break;\n  case "Friday":\n    console.log("Weekend is coming!");\n    break;\n  case "Saturday":\n  case "Sunday":\n    console.log("It\'s the weekend!");\n    break;\n  default:\n    console.log("Regular day");\n}',
       for: '// For Loop\nconsole.log("Counting from 1 to 5:");\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// Looping through an array\nlet fruits = ["apple", "banana", "orange"];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log("Fruit:", fruits[i]);\n}',
       while: '// While Loop\nlet count = 1;\n\nconsole.log("Counting with while loop:");\nwhile (count <= 5) {\n  console.log(count);\n  count++;\n}',
       define: '// Defining Functions\n\n// Function Declaration\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\n// Arrow Function\nconst add = (a, b) => a + b;\n\n// Function Expression\nconst multiply = function(a, b) {\n  return a * b;\n};\n\ngreet("Developer");\nconsole.log("2 + 3 =", add(2, 3));\nconsole.log("4 × 5 =", multiply(4, 5));',
       arrays: '// Arrays in JavaScript\nlet numbers = [1, 2, 3, 4, 5];\nlet mixed = ["hello", 42, true];\n\n// Array methods\nconsole.log("First:", numbers[0]);\nconsole.log("Length:", numbers.length);\n\nnumbers.push(6);  // Add to end\nconsole.log("After push:", numbers);\n\nlet doubled = numbers.map(n => n * 2);\nconsole.log("Doubled:", doubled);',
       objects: '// Objects in JavaScript\nlet person = {\n  name: "John",\n  age: 30,\n  city: "New York",\n  greet: function() {\n    console.log("Hi, I\'m " + this.name);\n  }\n};\n\nconsole.log("Name:", person.name);\nconsole.log("Age:", person["age"]);\nperson.greet();\n\n// Add new property\nperson.job = "Developer";\nconsole.log("Job:", person.job);',
       classes: '// Classes in JavaScript\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  \n  speak() {\n    console.log(this.name + " makes a sound");\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    console.log(this.name + " barks!");\n  }\n}\n\nlet animal = new Animal("Generic");\nlet dog = new Dog("Rex");\n\nanimal.speak();\ndog.speak();',
       'try-catch': '// Error Handling\ntry {\n  // Code that might throw an error\n  let result = JSON.parse("invalid json");\n} catch (error) {\n  console.log("Caught an error:", error.message);\n} finally {\n  console.log("This always runs");\n}\n\n// Custom error\nfunction divide(a, b) {\n  if (b === 0) throw new Error("Cannot divide by zero");\n  return a / b;\n}\n\ntry {\n  console.log(divide(10, 2));\n  console.log(divide(10, 0));\n} catch (e) {\n  console.log("Error:", e.message);\n}',
     },
     python: {
       intro: '# Welcome to Python!\n# Let\'s write your first program\nprint("Hello, World!")',
       syntax: '# Python Syntax Basics\n# Indentation is important in Python\nmessage = "Learning Python"\nprint(message)\n\n# No semicolons needed!',
       output: '# Printing output in Python\nprint("This is a message")\nprint("Number:", 42)\nprint("Boolean:", True)\nprint("Multiple", "values", "separated")',
       vars: '# Variables in Python\nname = "Alice"      # String\nage = 25            # Integer\nheight = 1.75       # Float\nis_student = True   # Boolean\n\nprint(f"Name: {name}")\nprint(f"Age: {age}")\nprint(f"Height: {height}m")',
       types: '# Data Types in Python\nstr_val = "Hello"         # String\nint_val = 42              # Integer\nfloat_val = 3.14          # Float\nbool_val = True           # Boolean\nlist_val = [1, 2, 3]      # List\ndict_val = {"key": "val"} # Dictionary\n\nprint(f"Type of str: {type(str_val)}")\nprint(f"Type of int: {type(int_val)}")\nprint(f"Type of list: {type(list_val)}")',
       for: '# For Loop in Python\nprint("Counting from 1 to 5:")\nfor i in range(1, 6):\n    print(i)\n\n# Looping through a list\nfruits = ["apple", "banana", "orange"]\nfor fruit in fruits:\n    print(f"Fruit: {fruit}")',
       while: '# While Loop in Python\ncount = 1\n\nprint("Counting with while loop:")\nwhile count <= 5:\n    print(count)\n    count += 1',
       define: '# Defining Functions in Python\n\ndef greet(name):\n    """Greet a person by name"""\n    print(f"Hello, {name}!")\n\ndef add(a, b):\n    return a + b\n\n# Lambda function\nmultiply = lambda a, b: a * b\n\ngreet("Developer")\nprint(f"2 + 3 = {add(2, 3)}")\nprint(f"4 × 5 = {multiply(4, 5)}")',
       arrays: '# Lists in Python\nnumbers = [1, 2, 3, 4, 5]\nmixed = ["hello", 42, True]\n\n# List operations\nprint(f"First: {numbers[0]}")\nprint(f"Length: {len(numbers)}")\n\nnumbers.append(6)  # Add to end\nprint(f"After append: {numbers}")\n\ndoubled = [n * 2 for n in numbers]  # List comprehension\nprint(f"Doubled: {doubled}")',
       classes: '# Classes in Python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        print(f"{self.name} makes a sound")\n\nclass Dog(Animal):\n    def speak(self):\n        print(f"{self.name} barks!")\n\nanimal = Animal("Generic")\ndog = Dog("Rex")\n\nanimal.speak()\ndog.speak()',
     },
     typescript: {
       intro: '// Welcome to TypeScript!\n// TypeScript adds types to JavaScript\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);',
       types: '// TypeScript Data Types\nlet str: string = "Hello";\nlet num: number = 42;\nlet bool: boolean = true;\nlet arr: number[] = [1, 2, 3];\nlet tuple: [string, number] = ["hello", 42];\n\n// Type inference\nlet inferred = "TypeScript infers this as string";\n\nconsole.log("String:", str);\nconsole.log("Array:", arr);',
       vars: '// Variables with Types\nlet name: string = "Alice";\nconst age: number = 25;\nlet isActive: boolean = true;\n\n// Type annotations\nfunction greet(name: string): void {\n  console.log(`Hello, ${name}!`);\n}\n\ngreet(name);',
     },
   };
 
   return starters[languageId]?.[lessonId] || getDefaultStarterCode(languageId);
 };
 
 const getDefaultStarterCode = (language: string): string => {
   const defaults: Record<string, string> = {
     javascript: '// Start coding here\nconsole.log("Hello, World!");',
     typescript: '// Start coding here\nconst message: string = "Hello, World!";\nconsole.log(message);',
     python: '# Start coding here\nprint("Hello, World!")',
     java: '// Start coding here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
     cpp: '// Start coding here\n#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
     c: '// Start coding here\n#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
   };
   return defaults[language] || `// Start coding in ${language}\n// Write your code here`;
 };
 
 // Detailed lesson content for specific languages
 const lessonContents: Record<string, Record<string, LessonContent>> = {
   javascript: {
     intro: {
       lessonId: 'intro',
       title: 'Introduction to JavaScript',
       notes: `JavaScript is the programming language of the web! It runs in your browser and lets you create interactive websites, build servers, make mobile apps, and so much more.
 
 JavaScript was created in 1995 and has become one of the most popular programming languages in the world. Every website you visit uses JavaScript to make things interactive and dynamic.`,
       keyPoints: [
         'JavaScript runs in web browsers and on servers',
         'It makes websites interactive and dynamic',
        'Created in 1995 by Brendan Eich',
         'JavaScript files end with .js extension',
        'Used by 97.8% of all websites',
       ],
      starterCode: '',
       tips: [
        'JavaScript is beginner-friendly and powerful',
        'You will start coding in the next lesson',
        'No prior programming experience needed',
       ],
      hasPractice: false,
     },
     vars: {
       lessonId: 'vars',
       title: 'Variables in JavaScript',
       notes: `Variables are containers that store data values. Think of them as labeled boxes where you can put different types of information.
 
 In JavaScript, we have three ways to declare variables:
 • **let** - for values that can change
 • **const** - for values that stay the same
 • **var** - the old way (avoid using this)
 
 Choose meaningful names for your variables that describe what they contain!`,
       keyPoints: [
         'Use "let" for values that might change',
         'Use "const" for values that stay constant',
         'Variable names are case-sensitive',
         'Names can contain letters, numbers, $ and _',
         'Names cannot start with a number',
       ],
       starterCode: '// Declaring Variables\n\n// Using let - value can change\nlet score = 0;\nconsole.log("Initial score:", score);\n\nscore = 100;  // We can change it!\nconsole.log("New score:", score);\n\n// Using const - value cannot change\nconst playerName = "Hero";\nconsole.log("Player:", playerName);\n\n// Try creating your own variables below:',
       tips: [
         'Always use const unless you need to reassign the value',
         'Use camelCase for variable names (myVariableName)',
         'Give variables descriptive names',
       ],
     },
     'if-else': {
       lessonId: 'if-else',
       title: 'If-Else Statements',
       notes: `If-else statements let your program make decisions! They check a condition and run different code depending on whether it's true or false.
 
 Think of it like a fork in the road: "If it's raining, take an umbrella. Otherwise, wear sunglasses."
 
 You can chain multiple conditions using "else if" for more complex decisions.`,
       keyPoints: [
         'if checks if a condition is true',
         'else runs when the condition is false',
         'else if checks additional conditions',
         'Conditions use comparison operators (==, ===, >, <, etc.)',
         'Always use === for strict equality',
       ],
       starterCode: '// If-Else Statements\n\nlet temperature = 25;\n\nif (temperature > 30) {\n  console.log("It\'s hot outside! 🌞");\n} else if (temperature > 20) {\n  console.log("Nice weather! 😊");\n} else if (temperature > 10) {\n  console.log("It\'s a bit chilly 🧥");\n} else {\n  console.log("It\'s cold! Stay warm ❄️");\n}\n\n// Try changing the temperature value!',
       tips: [
         'Change the temperature value to see different messages',
         'You can have as many else if blocks as needed',
         'The else block is optional',
       ],
     },
     for: {
       lessonId: 'for',
       title: 'For Loops',
       notes: `For loops repeat code a specific number of times. They're perfect when you know exactly how many times you want to repeat something.
 
 A for loop has three parts:
 1. **Initialization** - where to start (let i = 0)
 2. **Condition** - when to keep going (i < 5)
 3. **Update** - how to change after each loop (i++)
 
 Loops are incredibly useful for working with lists, counting, and automating repetitive tasks!`,
       keyPoints: [
         'for loops repeat code a set number of times',
         'i++ means "add 1 to i"',
         'i < 5 means "keep going while i is less than 5"',
         'Arrays can be looped using their length property',
       ],
       starterCode: '// For Loops\n\n// Basic counting loop\nconsole.log("Counting to 5:");\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// Looping through an array\nlet colors = ["red", "green", "blue"];\n\nconsole.log("\\nColors:");\nfor (let i = 0; i < colors.length; i++) {\n  console.log(colors[i]);\n}\n\n// Try creating your own loop!',
       tips: [
         'Be careful with your loop condition to avoid infinite loops',
         'Array indexes start at 0, not 1',
         'Use .length to get the number of items in an array',
       ],
     },
     arrays: {
       lessonId: 'arrays',
       title: 'Arrays & Lists',
       notes: `Arrays are like lists that can hold multiple values in order. Instead of creating separate variables for each item, you can store them all together!
 
 Arrays are zero-indexed, meaning the first item is at position 0, not 1.
 
 JavaScript arrays are very flexible - they can hold any type of data, even mixed types!`,
       keyPoints: [
         'Arrays store multiple values in order',
         'Access items using their index: array[0]',
         'First item is at index 0',
         'Use .push() to add items',
         'Use .length to get the count of items',
       ],
       starterCode: '// Arrays in JavaScript\n\n// Create an array\nlet fruits = ["apple", "banana", "orange"];\nconsole.log("Fruits:", fruits);\n\n// Access by index\nconsole.log("First fruit:", fruits[0]);\nconsole.log("Second fruit:", fruits[1]);\n\n// Add an item\nfruits.push("grape");\nconsole.log("After push:", fruits);\n\n// Array length\nconsole.log("Total fruits:", fruits.length);\n\n// Loop through array\nconsole.log("\\nAll fruits:");\nfor (let fruit of fruits) {\n  console.log("- " + fruit);\n}',
       tips: [
         'Remember: first index is 0, not 1',
         'Try .pop() to remove the last item',
         'Use .includes() to check if an item exists',
       ],
     },
   },
   python: {
     intro: {
       lessonId: 'intro',
       title: 'Introduction to Python',
       notes: `Python is known for its simple, readable syntax that's perfect for beginners. It's used everywhere - from web development to data science, AI, automation, and more!
 
 Python uses indentation (spaces) instead of curly braces to organize code. This makes Python code clean and easy to read.`,
       keyPoints: [
         'Python uses print() to display output',
         'Indentation (spaces) matters in Python',
         'No semicolons needed at the end of lines',
         'Python files end with .py extension',
       ],
       starterCode: '# Welcome to Python!\n# Let\'s write your first program\n\n# Use print() to display messages\nprint("Hello, World!")\n\n# Try printing your name below:\nprint("My name is ___")',
       tips: [
         'Comments start with # in Python',
         'Strings can use single or double quotes',
         'Python is case-sensitive',
       ],
     },
     vars: {
       lessonId: 'vars',
       title: 'Variables in Python',
       notes: `Python makes variables super easy! You don't need to declare the type - Python figures it out automatically.
 
 Just pick a name and use = to assign a value. Python is dynamically typed, meaning a variable can change type if you assign a different value.`,
       keyPoints: [
         'No need to declare variable types',
         'Python automatically detects the type',
         'Use snake_case for variable names',
         'Variables are case-sensitive',
       ],
       starterCode: '# Variables in Python\n\n# Python figures out the type automatically\nname = "Alice"\nage = 25\nheight = 1.75\nis_student = True\n\nprint(f"Name: {name}")\nprint(f"Age: {age}")\nprint(f"Height: {height}m")\nprint(f"Is student: {is_student}")\n\n# Create your own variables below:',
       tips: [
         'f-strings (f"...") let you embed variables in text',
         'Use type() to check a variable\'s type',
         'Python convention: use snake_case for variables',
       ],
     },
   },
 };