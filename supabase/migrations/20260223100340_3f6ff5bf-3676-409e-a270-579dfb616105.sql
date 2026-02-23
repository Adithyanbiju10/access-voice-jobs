
-- Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT[],
  accessibility_features TEXT[],
  category TEXT NOT NULL DEFAULT 'General',
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Jobs are publicly readable
CREATE POLICY "Jobs are publicly readable" ON public.jobs FOR SELECT USING (true);

-- Applications are publicly insertable (no auth required for v1)
CREATE POLICY "Anyone can apply" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Applications readable by email" ON public.applications FOR SELECT USING (true);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Resumes are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- Insert dummy jobs
INSERT INTO public.jobs (title, company, location, job_type, salary_range, description, requirements, accessibility_features, category) VALUES
('Customer Support Specialist', 'AccessTech Inc.', 'Remote', 'Full-time', '$35,000 - $45,000', 'Join our inclusive customer support team helping users navigate our accessible technology products. We provide full screen reader compatibility and adaptive tools.', ARRAY['Excellent communication skills', 'Patience and empathy', 'Basic computer knowledge'], ARRAY['Screen reader compatible', 'Flexible hours', 'Remote work'], 'Customer Service'),
('Data Entry Clerk', 'IncluWork Solutions', 'New York, NY', 'Part-time', '$18 - $22/hr', 'Accurate data entry position with adaptive keyboard support and voice-to-text options available. Quiet workspace with adjustable lighting.', ARRAY['Attention to detail', 'Typing proficiency', 'Basic Excel knowledge'], ARRAY['Adaptive keyboards', 'Voice-to-text', 'Adjustable workspace'], 'Administrative'),
('Software Developer', 'EqualCode Labs', 'San Francisco, CA', 'Full-time', '$80,000 - $120,000', 'Build accessible web applications that make a difference. Our development environment is fully accessible with screen readers and voice coding support.', ARRAY['JavaScript/TypeScript', 'React or Vue.js', 'Understanding of WCAG guidelines'], ARRAY['Screen reader IDE support', 'Voice coding tools', 'Flexible schedule'], 'Technology'),
('Graphic Designer', 'Creative Access Studio', 'Remote', 'Contract', '$40 - $60/hr', 'Create beautiful, accessible designs for our diverse client base. We use adaptive design tools and provide any accommodations needed.', ARRAY['Adobe Creative Suite', 'UI/UX design experience', 'Portfolio required'], ARRAY['Adaptive input devices', 'Flexible deadlines', 'Remote work'], 'Design'),
('Content Writer', 'VoiceFirst Media', 'Chicago, IL', 'Full-time', '$45,000 - $55,000', 'Write compelling content for our accessible media platform. Voice dictation and alternative input methods fully supported.', ARRAY['Strong writing skills', 'SEO knowledge', 'Research ability'], ARRAY['Voice dictation', 'Ergonomic setup', 'Hybrid work'], 'Content'),
('HR Coordinator', 'Diverse Talent Co.', 'Austin, TX', 'Full-time', '$42,000 - $52,000', 'Help build diverse and inclusive teams. Coordinate hiring processes with accessibility at the forefront.', ARRAY['HR experience', 'Strong organizational skills', 'Knowledge of ADA compliance'], ARRAY['Accessible office', 'Standing desk', 'Service animals welcome'], 'Human Resources'),
('Accounting Assistant', 'NumbersForAll LLC', 'Remote', 'Full-time', '$38,000 - $48,000', 'Assist with bookkeeping and accounting tasks using accessible financial software with screen reader support.', ARRAY['Basic accounting knowledge', 'QuickBooks experience', 'Attention to detail'], ARRAY['Screen reader compatible software', 'Remote work', 'Flexible hours'], 'Finance'),
('Social Media Manager', 'InclusiveVoice Agency', 'Los Angeles, CA', 'Full-time', '$50,000 - $65,000', 'Manage social media presence for brands committed to accessibility and inclusion. Create content that resonates with diverse audiences.', ARRAY['Social media expertise', 'Content creation', 'Analytics skills'], ARRAY['Adaptive tools provided', 'Hybrid work', 'Mental health days'], 'Marketing');
