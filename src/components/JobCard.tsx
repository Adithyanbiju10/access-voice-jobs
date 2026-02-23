import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Accessibility } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Tables } from '@/integrations/supabase/types';

interface JobCardProps {
  job: Tables<'jobs'>;
  index?: number;
}

const JobCard = ({ job, index = 0 }: JobCardProps) => {
  return (
    <Link to={`/jobs/${job.id}`} aria-label={`View ${job.title} at ${job.company}`}>
      <Card className="group cursor-pointer border transition-all hover:border-primary/40 hover:shadow-lg"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">{job.category}</Badge>
                <Badge variant="outline" className="text-xs">{job.job_type}</Badge>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                {job.salary_range && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary_range}</span>}
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(job.posted_at).toLocaleDateString()}</span>
              </div>
              {job.accessibility_features && job.accessibility_features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.accessibility_features.slice(0, 3).map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                      <Accessibility className="h-3 w-3" />{f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default JobCard;
