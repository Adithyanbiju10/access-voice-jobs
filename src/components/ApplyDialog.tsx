import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, CheckCircle } from 'lucide-react';

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

const ApplyDialog = ({ open, onOpenChange, jobId, jobTitle }: ApplyDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      let resumeUrl: string | null = null;

      if (file) {
        const ext = file.name.split('.').pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('resumes').upload(path, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(path);
        resumeUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        applicant_name: name,
        applicant_email: email,
        cover_letter: coverLetter || null,
        resume_url: resumeUrl,
      });

      if (error) throw error;

      setSuccess(true);
      toast({ title: 'Application submitted!', description: 'We will get back to you soon.' });
    } catch (err: any) {
      toast({ title: 'Error submitting application', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setName(''); setEmail(''); setCoverLetter(''); setFile(null); setSuccess(false);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Apply for {jobTitle}</DialogTitle>
          <DialogDescription>Fill in your details and upload your resume.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="h-16 w-16 text-success" />
            <p className="text-lg font-heading font-semibold">Application Submitted!</p>
            <p className="text-sm text-muted-foreground text-center">Thank you for applying. We'll review your application shortly.</p>
            <Button onClick={() => handleClose(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" required />
            </div>
            <div>
              <Label htmlFor="cover">Cover Letter (optional)</Label>
              <Textarea id="cover" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit..." rows={3} />
            </div>
            <div>
              <Label htmlFor="resume">Resume</Label>
              <div className="mt-1 flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-4 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors w-full">
                  <Upload className="h-4 w-4" />
                  {file ? file.name : 'Click to upload resume (PDF, DOC)'}
                  <input id="resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyDialog;
