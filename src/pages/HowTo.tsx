import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ContentAd from '@/components/ContentAd';
import { BookOpen, MessageCircle, Languages, PenLine, ImageIcon, HelpCircle, Library, ArrowRight } from 'lucide-react';

const guides = [
  {
    icon: BookOpen,
    slug: 'library',
    title: 'How to use the TVET Library',
    to: '/library',
    steps: [
      'Open the Library from the sidebar or home page.',
      'Pick your sector — ICT, Energy, Construction, Agriculture, General Studies, and more.',
      'Choose your course, then your level (L3, L4 or L5).',
      'Open any module to view notes, PDFs, and practice questions inline.',
      'Use the search bar at the top of the library to jump straight to a module by name.',
    ],
    tip: 'Bookmark the modules you are revising this week so they appear on your home screen.',
  },
  {
    icon: MessageCircle,
    slug: 'tutor',
    title: 'How to get the best answers from the Smart Tutor',
    to: '/learn',
    steps: [
      'Open Learn → Smart Tutor.',
      'Choose your subject or paste the topic you are studying.',
      'Ask a specific question. "Explain Newton\'s second law with an example about a car" beats "explain physics."',
      'Ask follow-ups. If an answer is too advanced, say "explain it simpler." If too simple, say "go deeper."',
      'Ask for a practice quiz on the same topic once you feel confident.',
    ],
    tip: 'Say "answer in Kinyarwanda" or "answer in French" any time you want to switch languages.',
  },
  {
    icon: Languages,
    slug: 'translate',
    title: 'How to use the Translator',
    to: '/translate',
    steps: [
      'Open the Translate tool.',
      'Pick the source language and the target language — Kinyarwanda is fully supported.',
      'Paste or type your text. Long paragraphs work fine.',
      'Tap the speaker icon to hear the translation read aloud.',
      'Copy the result with one tap for use in your notes or WhatsApp.',
    ],
    tip: 'For technical or curriculum terms, translate the full sentence rather than the single word — context improves accuracy.',
  },
  {
    icon: PenLine,
    slug: 'writer',
    title: 'How to use the Writer Studio',
    to: '/ai-writer',
    steps: [
      'Open Writer Studio.',
      'Choose a template — CV, Cover Letter, Friendly Letter, Essay, Report.',
      'Fill in the editable fields. You can leave any field blank and the app will suggest content.',
      'Preview the document in the built-in editor.',
      'Export as PDF, DOCX, or plain TXT.',
    ],
    tip: 'Writer Studio works fully offline — perfect for exam preparation on a slow connection.',
  },
  {
    icon: ImageIcon,
    slug: 'design',
    title: 'How to use the Design Studio',
    to: '/generate-image',
    steps: [
      'Open Design Studio.',
      'Type a clear prompt: "poster for a school science fair, dark blue, futuristic."',
      'Or upload your own photo and use Quick Retouch presets like Auto Enhance or HDR Boost.',
      'Fine-tune with the temperature, hue, saturation, and vignette sliders.',
      'Download the finished image or share it directly.',
    ],
    tip: 'For text on posters, always add the exact wording in quotes inside the prompt.',
  },
  {
    icon: HelpCircle,
    slug: 'homework',
    title: 'How to use the Homework Helper',
    to: '/ai-homework-helper',
    steps: [
      'Open Homework Helper.',
      'Take a clear photo of the problem or type it out.',
      'Choose whether you want the final answer only or a full step-by-step solution.',
      'Read the explanation, then close it and try the problem yourself on paper.',
      'Re-open it only to check your working, not to copy.',
    ],
    tip: 'Homework Helper is a study partner, not a cheat sheet — the students who improve fastest always solve it themselves first.',
  },
];

const HowTo: React.FC = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="How-To Guides — SmartMind Tools"
      description="Step-by-step guides for every SmartMind tool: TVET Library, Smart Tutor, Translator, Writer Studio, Design Studio, and Homework Helper."
      path="/how-to"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: guides.map((g, i) => ({
          '@type': 'HowTo',
          position: i + 1,
          name: g.title,
          step: g.steps.map((s) => ({ '@type': 'HowToStep', text: s })),
        })),
      }}
    />
    <Navbar />
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">How-To Guides</h1>
        <p className="text-lg text-muted-foreground">
          A short, honest walkthrough for every tool in SmartMind. Each one takes less than two
          minutes to read.
        </p>
      </header>

      <div className="space-y-8">
        {guides.map((g, i) => (
          <React.Fragment key={g.slug}>
            <article id={g.slug} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <g.icon className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">{g.title}</h2>
              </div>
              <ol className="space-y-2 list-decimal list-inside text-foreground/90 mb-4">
                {g.steps.map((s, j) => (
                  <li key={j} className="leading-relaxed">{s}</li>
                ))}
              </ol>
              <p className="text-sm text-muted-foreground italic mb-4">Tip: {g.tip}</p>
              <Link to={g.to} className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
                Open the tool <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
            {i === 2 && <ContentAd />}
          </React.Fragment>
        ))}
      </div>

      <section className="mt-14 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Library className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">New to SmartMind?</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Start with the TVET Library if you are a Rwandan TVET student, or the Smart Tutor if you
          just have a question you want answered right now.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/library" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90">Open Library</Link>
          <Link to="/learn" className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90">Open Tutor</Link>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default HowTo;
