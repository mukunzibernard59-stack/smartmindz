import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ContentAd from '@/components/ContentAd';
import { posts } from '@/data/blogPosts';
import { Calendar, Clock } from 'lucide-react';

const Blog: React.FC = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="SmartMind Blog — Study Tips, Career, and Learning Guides"
      description="Original articles on studying for Rwanda TVET exams, learning languages, building career skills, and getting the most from AI study tools."
      path="/blog"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'SmartMind Blog',
        url: 'https://smartmindz.lovable.app/blog',
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          author: { '@type': 'Organization', name: p.author },
          url: `https://smartmindz.lovable.app/blog/${p.slug}`,
        })),
      }}
    />
    <Navbar />
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">The SmartMind Blog</h1>
        <p className="text-lg text-muted-foreground">
          Original writing on learning, studying, careers, and life as a student in Africa.
        </p>
      </header>

      <div className="grid gap-6">
        {posts.map((p, idx) => (
          <React.Fragment key={p.slug}>
            <article className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex flex-wrap gap-2 mb-3">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{t}</span>
                ))}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                <Link to={`/blog/${p.slug}`} className="hover:text-primary">{p.title}</Link>
              </h2>
              <p className="text-muted-foreground mb-4">{p.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(p.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readMinutes} min read</span>
                <Link to={`/blog/${p.slug}`} className="text-primary hover:underline ml-auto">Read →</Link>
              </div>
            </article>
            {idx === 2 && <ContentAd />}
          </React.Fragment>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Blog;
