import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calculator, 
  FlaskConical, 
  BookText, 
  Globe2, 
  Monitor, 
  History, 
  Music, 
  Palette,
  Languages,
  Atom,
  Leaf,
  TrendingUp
} from 'lucide-react';

const Subjects: React.FC = () => {
  const { t } = useLanguage();

  const subjects = [
    { icon: Calculator, name: 'Mathematics', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { icon: FlaskConical, name: 'Science', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    { icon: BookText, name: 'English', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { icon: Languages, name: 'French', color: 'bg-pink-500/10 text-pink-600 border-pink-500/20' },
    { icon: Monitor, name: 'ICT', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' },
    { icon: History, name: 'History', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { icon: Globe2, name: 'Geography', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { icon: Atom, name: 'Physics', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
    { icon: Leaf, name: 'Biology', color: 'bg-lime-500/10 text-lime-600 border-lime-500/20' },
    { icon: TrendingUp, name: 'Economics', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    { icon: Palette, name: 'Art', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
    { icon: Music, name: 'Music', color: 'bg-violet-500/10 text-violet-600 border-violet-500/20' },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('subjects.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            Get help with any subject you're studying
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subjects.map((subject, index) => (
            <div
              key={subject.name}
              className="group flex flex-col items-center p-5 bg-card rounded-2xl border border-border hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center mb-3 border transition-transform group-hover:scale-110`}>
                <subject.icon className="h-6 w-6" />
              </div>
              <span className="font-medium text-sm text-center">{subject.name}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8">
          + 100 more subjects available
        </p>
      </div>
    </section>
  );
};

export default Subjects;
