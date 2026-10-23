import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const features = [
  { to: '/library', title: 'TVET Library', desc: 'Browse courses by sector, level (L3, L4, L5) and module, and open notes and PDFs inside the app.' },
  { to: '/guides', title: 'Study Guides', desc: 'Plain-language summaries of key topics, with practice questions and explained answers for six TVET sectors.' },
  { to: '/learn', title: 'Smart Tutor and Quizzes', desc: 'Ask a question, get a step-by-step explanation, and practise with quizzes on the topic.' },
  { to: '/translate', title: 'Translator', desc: 'Translate between English, French, Kinyarwanda and Swahili by typing or speaking, with read-aloud.' },
  { to: '/ai-writer', title: 'Writer Studio', desc: 'Templates for letters, CVs and reports that you can edit and export as PDF, DOCX or TXT.' },
  { to: '/youtube-tutor', title: 'YouTube Learning Hub', desc: 'Paste a YouTube lesson link and get a summary, key points and quiz questions to study from.' },
  { to: '/dev', title: 'Dev Mode', desc: 'Practise coding with lessons, challenges and an in-browser editor.' },
  { to: '/blog', title: 'Blog', desc: 'Articles on revision, internships, interviews and digital skills written for TVET students.' },
];

const SEOContent: React.FC = () => {
  return (
    <div className="relative">
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            What is SmartMind?
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              SmartMind is a free learning app for students in Rwanda, especially those in TVET (Technical and Vocational
              Education and Training) schools. It puts course notes, study guides, a translator and writing tools in one place
              that works on an ordinary phone.
            </p>
            <p>
              The TVET Library organises material from Rwanda's published competency-based curriculum by sector, course,
              level and module. Our study guides and blog articles are written by the SmartMind team to help you understand
              the ideas behind the modules, not to replace your school's official materials or your trainer.
            </p>
            <p>
              SmartMind is free to use and is supported by advertising on its article pages. You do not need an account to
              read the guides, the blog or the library.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            What you can do here
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.to} to={f.to} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all duration-300 block">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground mb-3">{f.desc}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Who it is for
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">TVET learners</strong> preparing for assessments can use the library and
              guides to check what each module covers, then practise with quizzes and explained answers.
            </p>
            <p>
              <strong className="text-foreground">Trainers</strong> can use the quiz and writing tools to prepare practice
              material, and can ask us to add or correct a module through the contact page.
            </p>
            <p>
              <strong className="text-foreground">Job seekers and interns</strong> will find articles on writing a first CV,
              preparing for interviews and internships, and the digital skills employers expect.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Using AI tools responsibly
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The Smart Tutor and quiz generator use AI, and AI can make mistakes. Treat its answers as a starting point and
            check important facts against your official course materials or ask your trainer. The tutor is designed to
            explain methods step by step so that you learn to solve the problem yourself. Read more in our{' '}
            <Link to="/faq" className="text-primary hover:underline">FAQ</Link> and{' '}
            <Link to="/about" className="text-primary hover:underline">About page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SEOContent;
