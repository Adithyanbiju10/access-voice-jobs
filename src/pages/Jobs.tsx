import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import JobCard from '@/components/JobCard';
import { useVoice } from '@/contexts/VoiceContext';
import type { Tables } from '@/integrations/supabase/types';

const Jobs = () => {
  const [jobs, setJobs] = useState<Tables<'jobs'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { isVoiceMode, speak, listen } = useVoice();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase.from('jobs').select('*').eq('is_active', true).order('posted_at', { ascending: false });
      setJobs(data || []);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (isVoiceMode && !loading && jobs.length > 0) {
      speak(`There are ${jobs.length} jobs available. You can say a job title to search. The jobs are: ${jobs.slice(0, 3).map(j => j.title).join(', ')}, and more.`);
    }
  }, [isVoiceMode, loading]);

  const handleVoiceSearch = async () => {
    const query = await listen();
    if (query) setSearch(query);
  };

  const categories = ['all', ...Array.from(new Set(jobs.map(j => j.category)))];

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || j.category === category;
    return matchSearch && matchCat;
  });

  return (
    <main className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Browse Jobs</h1>
        <p className="text-muted-foreground">Find accessible job opportunities from inclusive employers.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs or companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
            aria-label="Search jobs"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isVoiceMode && (
          <button onClick={handleVoiceSearch} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground text-sm font-medium voice-pulse" aria-label="Voice search">
            🎤 Voice Search
          </button>
        )}
      </div>

      {/* Jobs list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">No jobs found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Jobs;
