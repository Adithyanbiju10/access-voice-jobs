import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Home, Info, Mic, MicOff, Moon, Sun, Menu, X } from 'lucide-react';
import { useVoice } from '@/contexts/VoiceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/about', label: 'About', icon: Info },
];

const Navbar = () => {
  const location = useLocation();
  const { isVoiceMode, setIsVoiceMode, speak, isListening, isSpeaking } = useVoice();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleVoiceToggle = async () => {
    const next = !isVoiceMode;
    setIsVoiceMode(next);
    if (next) {
      await speak('Voice mode activated');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md" role="navigation" aria-label="Main navigation">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary" aria-label="AbilityJobs Home">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </div>
          <span>AbilityJobs</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
                ${location.pathname === to
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceToggle}
            aria-label={isVoiceMode ? 'Disable voice mode' : 'Enable voice mode'}
            className={isVoiceMode ? 'text-primary voice-pulse' : 'text-muted-foreground'}
          >
            {isVoiceMode ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                ${location.pathname === to
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
                }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      )}

      {(isListening || isSpeaking) && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 rounded-full bg-primary px-4 py-1 text-xs text-primary-foreground font-medium shadow-lg">
          {isListening ? '🎤 Listening...' : '🔊 Speaking...'}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
