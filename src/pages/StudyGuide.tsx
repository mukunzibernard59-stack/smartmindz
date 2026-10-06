import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getGuideBySlug, studyGuides } from '@/data/studyGuides';
import { ArrowLeft, BookOpen, HelpCircle, Library as LibraryIcon } from 'lucide-react';

const StudyGuide: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuideBySlug(slug) : undefined;

  if (!guide) return <Navigate to="/guides" replace />;

  const related = studyGuides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${guide.subject} Study Guide | SmartMind`}
        description={guide.description}
        path={`/guides/${guide.slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: `${guide.subject} Study Guide`,
          description: guide.description,
          educationalLevel: 'TVET',
          about: guide.subject,
          dateModified: '2026-10-01',
        }}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/guides" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Study Guides
        </Link>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{guide.subject} Study Guide</h1>
          <p className="text-xl text-muted-foreground mb-8">{guide.description}</p>

          <section className="mb-10 space-y-4">
            {guide.intro.map((p, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed">{p}</p>
            ))}
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" /> Key Topics
            </h2>
            <div className="space-y-6">
              {guide.keyTopics.map((topic) => (
                <div key={topic.title}>
                  <h3 className="text-lg font-semibold mb-1 text-foreground">{topic.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{topic.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <LibraryIcon className="h-6 w-6 text-primary" /> Module Summaries
            </h2>
            <div className="space-y-4">
              {guide.moduleSummaries.map((mod) => (
                <div key={mod.title} className="p-4 rounded-lg bg-card border border-border">
                  <h3 className="font-semibold mb-1 text-foreground">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground">{mod.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" /> Practice Questions
            </h2>
            <div className="space-y-6">
              {guide.practiceQuestions.map((q, i) => (
                <div key={i} className="p-4 rounded-lg bg-card border border-border">
                  <p className="font-semibold mb-2 text-foreground">{i + 1}. {q.question}</p>
                  <p className="text-sm text-primary mb-1"><strong>Answer:</strong> {q.answer}</p>
                  <p className="text-sm text-muted-foreground"><strong>Why:</strong> {q.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 p-5 rounded-lg bg-card border border-border">
            <h2 className="text-xl font-bold mb-3">What to do next</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                Explore the full <Link to="/library" className="text-primary hover:underline">TVET Library</Link> for
                your school's official courses, levels and resources in this sector.
              </li>
              <li>
                Practice explaining these topics out loud with <Link to="/learn" className="text-primary hover:underline">Smart Tutor</Link>,
                which can quiz you and answer follow-up questions.
              </li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground border-t border-border pt-6">
            Last reviewed: 2026-10-01 · Learn more <Link to="/about" className="text-primary hover:underline">about SmartMind</Link>.
          </p>
        </article>

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-bold mb-4">Other Study Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((g) => (
                <Link key={g.slug} to={`/guides/${g.slug}`} className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  <span className="font-semibold text-sm">{g.subject}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StudyGuide;
