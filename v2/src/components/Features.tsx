import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Mic, Brain, FileQuestion, Calendar, Globe } from 'lucide-react';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: MessageCircle,
      title: t('features.ai.title'),
      description: t('features.ai.desc'),
      color: 'primary',
    },
    {
      icon: Mic,
      title: t('features.voice.title'),
      description: t('features.voice.desc'),
      color: 'accent',
    },
    {
      icon: Brain,
      title: t('features.quiz.title'),
      description: t('features.quiz.desc'),
      color: 'success',
    },
    {
      icon: FileQuestion,
      title: t('features.homework.title'),
      description: t('features.homework.desc'),
      color: 'warning',
    },
    {
      icon: Calendar,
      title: 'Study Plans',
      description: 'AI creates personalized daily and weekly study schedules based on your goals',
      color: 'primary',
    },
    {
      icon: Globe,
      title: '4 Languages',
      description: 'Learn in English, French, Kinyarwanda, or Swahili - your choice',
      color: 'accent',
    },
  ];

  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful AI tools designed to help you learn faster and smarter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-5 border transition-transform group-hover:scale-110`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
