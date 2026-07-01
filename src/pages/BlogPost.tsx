import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ContentAd from '@/components/ContentAd';
import { getPost, posts } from '@/data/blogPosts';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const renderMarkdown = (md: string) => {
  const blocks = md.split(/\n\n+/);
  return blocks.map((b, i) => {
    if (b.startsWith('## ')) {
      return <h2 key={i} className="text-2xl font-bold mt-8 mb-3">{b.slice(3)}</h2>;
    }
    return <p key={i} className="mb-4 leading-relaxed text-foreground/90">{b}</p>;
  });
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} — SmartMind Blog`}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: { '@type': 'Organization', name: post.author },
          publisher: { '@type': 'Organization', name: 'SmartMind' },
          mainEntityOfPage: `https://smartmindz.lovable.app/blog/${post.slug}`,
        }}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <article>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{t}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{post.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10 pb-6 border-b border-border">
            <span>By {post.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readMinutes} min read</span>
          </div>

          <div className="prose prose-lg max-w-none">
            {renderMarkdown(post.content)}
          </div>

          <ContentAd />
        </article>

        <section className="mt-16 pt-8 border-t border-border">
          <h3 className="text-2xl font-bold mb-6">Keep reading</h3>
          <div className="grid gap-4">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="block p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-card/50 transition-colors">
                <h4 className="font-semibold mb-1">{p.title}</h4>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
