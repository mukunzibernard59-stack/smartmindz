import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { studyGuides } from '@/data/studyGuides';
import { BookOpen, ChevronRight } from 'lucide-react';

const Guides: React.FC = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="TVET Study Guides | SmartMind"
      description="Free study guides for Rwanda TVET subjects: ICT, Energy, Construction, Hospitality, Agriculture, Transport & Logistics and more, with key topics and practice questions."
      path="/guides"
    />
    <Navbar />
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">TVET Study Guides</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Free, public study guides covering the main TVET subject areas — key topics explained in plain
        language, module summaries, and practice questions to test your understanding. Use these alongside
        the full curriculum resources in the Library.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {studyGuides.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="group p-5 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] transition-all"
          >
            <div className="flex items-center gap-2 mb-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span className="font-semibold text-lg group-hover:underline">{guide.subject}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{guide.description}</p>
            <span className="inline-flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Read guide <ChevronRight className="h-3 w-3 ml-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Guides;
