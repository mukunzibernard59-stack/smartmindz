import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles, Brain, BookOpen, Clock } from 'lucide-react';

const HomeworkHelper: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "AI That Explains Homework Step by Step (Free for Students in 2026)",
    "description": "Stuck on homework? Discover how an AI that explains homework step by step can help you actually understand the answer — not just copy it. Try SmartMind free.",
    "author": { "@type": "Organization", "name": "SmartMind" },
    "publisher": { "@type": "Organization", "name": "SmartMind" },
    "datePublished": "2026-04-23",
    "mainEntityOfPage": "https://smartmindz.lovable.app/ai-homework-helper"
  };

  return (
    <div className="min-h-screen relative">
      <Helmet>
        <title>AI That Explains Homework Step by Step (Free) | SmartMind</title>
        <meta name="description" content="Need an AI that explains homework step by step? SmartMind walks you through every problem in plain English. Free, no signup hassle. Try it now." />
        <link rel="canonical" href="https://smartmindz.lovable.app/ai-homework-helper" />
        <meta property="og:title" content="AI That Explains Homework Step by Step — SmartMind" />
        <meta property="og:description" content="Stop copying answers. SmartMind is the AI tutor that explains every homework problem step by step, like a real teacher." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://smartmindz.lovable.app/ai-homework-helper" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <ParticlesBackground />
      <Navbar />

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">For students • Free to try</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The <span className="text-gradient-primary">AI That Explains Homework Step by Step</span> — and Actually Makes Sense
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Tired of staring at a math problem at 11 PM? Or reading a science question three times and still not getting it? You're not alone. This is the simple guide to using an AI that breaks down your homework — one step at a time — so you actually understand it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/learn">
                <Button size="lg" className="gap-2">
                  Try SmartMind Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button size="lg" variant="outline">See How It Works</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="pb-20">
          <div className="container mx-auto px-4 max-w-3xl prose-content space-y-12 text-foreground">

            <section>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                What is an AI that explains homework step by step?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most homework apps just give you the answer. That's nice for 5 seconds — until your teacher asks "how did you get this?" and you freeze. An <strong className="text-foreground">AI that explains homework step by step</strong> is different. It works like a patient tutor sitting next to you: it reads the question, breaks it into small parts, shows the reasoning, and tells you <em>why</em> each step happens.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Think of it like a math teacher who never gets tired, never judges your "dumb" question, and is awake at 2 AM the night before your exam.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                How it works (in plain English)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You don't need to be a tech person. Here's the whole process:
              </p>
              <ul className="space-y-3">
                {[
                  "Type your question — or snap a photo of it.",
                  "The AI reads the problem and figures out the topic (algebra, biology, essay, code, anything).",
                  "It writes the solution one step at a time, with short explanations under each step.",
                  "If you don't get a step, you ask: 'wait, why did you do that?' — and it explains again, simpler.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-3">A real example</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Say you got this: <em>"Solve 3(x − 4) = 18."</em> A normal answer app says <strong className="text-foreground">x = 10</strong>. Done. Useless.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">A step-by-step AI like SmartMind shows:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
                <li>Open the brackets: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-sm">3x − 12 = 18</code></li>
                <li>Add 12 to both sides: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-sm">3x = 30</code></li>
                <li>Divide both sides by 3: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-sm">x = 10</code></li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Now next time you see a similar question on a test, you actually know what to do. That's the whole difference.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Best AI homework helpers in 2026 (ranked)
              </h2>
              <div className="space-y-4">
                <div className="glass p-6 rounded-2xl border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">#1 PICK</span>
                    <h3 className="text-xl font-bold">SmartMind</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Built specifically for students. Explains every problem step by step in simple language, supports voice, photos, and works on phone or laptop. Free to start, no credit card.
                  </p>
                </div>
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-2">#2 General chatbots (ChatGPT, Gemini)</h3>
                  <p className="text-muted-foreground">Powerful, but not designed for students. You have to keep asking "explain simpler" again and again.</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-2">#3 Photo-math apps</h3>
                  <p className="text-muted-foreground">Good for quick math answers, but weak on essays, science theory, and code.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Why SmartMind is different
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Brain, title: "Teaches like a human", desc: "Short, friendly steps — not a wall of text." },
                  { icon: BookOpen, title: "Every subject", desc: "Math, physics, chemistry, biology, English, history, coding." },
                  { icon: Clock, title: "Open 24/7", desc: "No appointment. No tutor fee. Just open and ask." },
                  { icon: Sparkles, title: "Voice + photo input", desc: "Take a picture of your homework or just speak the question." },
                ].map((f) => (
                  <div key={f.title} className="glass p-5 rounded-2xl">
                    <f.icon className="h-6 w-6 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Frequently asked questions
              </h2>
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold mb-1">Is SmartMind really free?</h3>
                  <p className="text-muted-foreground">Yes. You can use it free every day. No paywall before you try it.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Will my teacher know I used AI?</h3>
                  <p className="text-muted-foreground">If you copy-paste, maybe. But if you actually <em>read the steps</em> and write the answer in your own words, you'll learn the topic — that's the whole point.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Does it work on my phone?</h3>
                  <p className="text-muted-foreground">Yes — phone, tablet, laptop. It also works as an installable app.</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center glass p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Stop copying answers. Start understanding.
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Try SmartMind right now — paste your homework question and watch it walk you through the answer step by step.
              </p>
              <Link to="/learn">
                <Button size="lg" className="gap-2">
                  Open SmartMind Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </section>

          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default HomeworkHelper;
