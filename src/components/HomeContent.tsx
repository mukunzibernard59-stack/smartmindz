import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Languages, PenLine, Youtube, Compass } from 'lucide-react';

const studySteps = [
  {
    title: '1. Read the note',
    text: 'Open the Library and read the lesson for your module. Notes are short and focused, so you can finish one in a single sitting.',
  },
  {
    title: '2. Check the study guide',
    text: 'Each guide summarises the key ideas for a subject and ends with practice questions, so you can check what you actually remember.',
  },
  {
    title: '3. Test yourself',
    text: 'Ask the learning assistant to quiz you on the topic you just read. Getting a question wrong shows you exactly what to revise.',
  },
  {
    title: '4. Revise the weak points',
    text: 'Go back to the note for anything you missed, then test yourself again a day later. Spaced revision is what makes knowledge stick.',
  },
];

const tools = [
  {
    icon: BookOpen,
    name: 'TVET Library',
    path: '/library',
    text: 'Course notes and documents organised by sector, course, level and module.',
  },
  {
    icon: GraduationCap,
    name: 'Study Guides',
    path: '/guides',
    text: 'Subject overviews with revision questions and explained answers.',
  },
  {
    icon: Languages,
    name: 'Translator',
    path: '/translate',
    text: 'Translate between English, French, Kinyarwanda and Swahili, with voice input and read-aloud.',
  },
  {
    icon: Youtube,
    name: 'YouTube Tutor',
    path: '/youtube-tutor',
    text: 'Search for a topic and watch educational videos without leaving the app.',
  },
  {
    icon: PenLine,
    name: 'Writer',
    path: '/ai-writer',
    text: 'Draft letters, essays and documents, then edit them in your own words.',
  },
  {
    icon: Compass,
    name: 'Blog',
    path: '/blog',
    text: 'Study tips, career guidance and learning strategies written for Rwandan students.',
  },
];

const HomeContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pb-16 space-y-14">
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">What SmartMindz is for</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-3">
          SmartMindz is a free study companion for Rwandan students — especially learners in TVET
          (Technical and Vocational Education and Training) schools and secondary school. It puts
          course notes, study guides and practice tools in one place, on the phone you already have,
          so you can revise anywhere without paying for textbooks or data-heavy websites.
        </p>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          The app is independent: it is not run by the Rwanda TVET Board or any school. Library
          materials are based on published TVET curricula and remain the property of their original
          authors — see our <Link to="/about" className="text-primary underline">About</Link> and{' '}
          <Link to="/copyright" className="text-primary underline">Copyright</Link> pages for details.
        </p>
      </section>

      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">What you can study today</h2>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
          The library currently covers Software Development (ICT &amp; Multimedia) — including PHP
          programming, databases, version control and Vue.js — plus six study guides and a growing
          blog. More subjects and sectors are being added over time.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group rounded-lg bg-card border border-border p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <tool.icon className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm group-hover:text-primary transition-colors">{tool.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">How to study with SmartMindz</h2>
        <div className="space-y-3">
          {studySteps.map((step) => (
            <div key={step.title} className="rounded-lg bg-card border border-border p-4">
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6">
          New here? Start with the <Link to="/how-to" className="text-primary underline">how-to guides</Link> or
          read the <Link to="/faq" className="text-primary underline">FAQ</Link>.
        </p>
      </section>
    </div>
  );
};

export default HomeContent;
