import { Link } from 'react-router-dom';
import { ArrowRight, Accessibility, Mic, Search, Shield, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/contexts/VoiceContext';
import { useEffect } from 'react';

const features = [
  { icon: Accessibility, title: 'Fully Accessible', desc: 'Built for all abilities with WCAG compliance and adaptive features.', iconColor: 'text-primary', bgColor: 'bg-primary/10' },
  { icon: Mic, title: 'Voice Navigation', desc: 'Complete voice control for visually impaired users.', iconColor: 'text-accent-foreground', bgColor: 'bg-accent/10' },
  { icon: Search, title: 'Smart Job Matching', desc: 'Filter jobs by your specific accessibility needs.', iconColor: 'text-success', bgColor: 'bg-success/10' },
  { icon: Shield, title: 'Safe & Inclusive', desc: 'Every employer is vetted for inclusive workplace practices.', iconColor: 'text-primary', bgColor: 'bg-primary/10' },
];

const Index = () => {
  const { isVoiceMode, speak } = useVoice();

  useEffect(() => {
    if (isVoiceMode) {
      speak('You are on the home page. Say "jobs" to browse jobs, or "about" to learn more about us.');
    }
  }, [isVoiceMode]);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
        <div className="container relative flex flex-col items-center py-20 md:py-32 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
            <Sparkles className="h-4 w-4" /> Jobs for Everyone
          </span>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-3xl leading-tight">
            Find Your Dream Job,{' '}
            <span className="text-primary">Without Barriers</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            The inclusive job platform designed for people of all abilities. Voice-enabled, accessible, and packed with opportunities from inclusive employers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8 shadow-lg shadow-primary/20">
              <Link to="/jobs">
                Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <h2 className="font-heading text-2xl font-bold text-center mb-12">Why AbilityJobs?</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc, iconColor, bgColor }) => (
            <div key={title} className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
              <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <h3 className="font-heading text-base font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 py-16">
        <div className="container text-center">
          <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Browse hundreds of accessible job opportunities from employers who value inclusion.</p>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link to="/jobs">View All Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;
