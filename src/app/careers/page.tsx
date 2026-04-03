
"use client"

import { useState, useRef } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { JobOffer } from '@/app/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, MapPin, Clock, ChevronRight, Loader2, Sparkles, Send, Paperclip, FileText, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function CareersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isApplying, setIsApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: jobs, isLoading } = useCollection<JobOffer>(jobsQuery);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64 prototype
        toast({ title: "File Too Large", description: "Please provide a document smaller than 2MB.", variant: "destructive" });
        return;
      }
      
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setResumeBase64(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedJob) return;

    setIsApplying(true);
    
    const applicationsRef = collection(db, 'jobs', selectedJob.id, 'applications');
    const timestamp = new Date().toISOString();

    const application = {
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      applicantName: applicationData.name,
      applicantEmail: applicationData.email,
      message: applicationData.message,
      resumeData: resumeBase64,
      status: 'Pending',
      createdAt: timestamp
    };

    addDocumentNonBlocking(applicationsRef, application);

    toast({
      title: "Credentials Received",
      description: "The Baron's council will review your vision shortly.",
    });

    setApplicationData({ name: '', email: '', message: '' });
    setResumeBase64(null);
    setFileName(null);
    setSelectedJob(null);
    setIsApplying(false);
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/baron-careers/1920/1080"
          alt="Join the Baron Elite"
          fill
          priority
          className="object-cover opacity-30 grayscale-[0.3]"
          data-ai-hint="luxury office"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="container relative z-10 px-4 text-center space-y-6">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-1 text-xs tracking-[0.3em] font-bold">JOIN THE EMPIRE</Badge>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none">
            SHAPING THE <br /><span className="text-secondary">FUTURE</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            At Blubber Baron, we don't just offer jobs; we offer a seat at the table of luxury and innovation.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden glass-card gold-glow border-none">
            <Image 
              src="https://picsum.photos/seed/baron-culture/1000/750" 
              alt="Our Culture" 
              fill 
              className="object-cover"
              data-ai-hint="team luxury"
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">The Baron's Inner Circle</h2>
              <div className="h-1 w-24 bg-secondary" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              We are a collective of designers, visionaries, and shisha aficionados dedicated to redefining the standards of the industry.
            </p>
            <div className="space-y-4">
              {[
                "Global networking opportunities with luxury brands.",
                "Access to the Baron's exclusive research and development labs.",
                "A collaborative environment that values aesthetic precision."
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="container mx-auto px-4 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-[0.3em] text-xs">
              <Sparkles className="h-3 w-3" />
              Open Engagements
            </div>
            <h2 className="text-4xl font-headline font-bold">Available Positions</h2>
          </div>
          <Badge variant="outline" className="text-muted-foreground border-border px-4 py-1">
            {isLoading ? '...' : (jobs?.length || 0)} Opportunities
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="glass-card border-none hover:gold-glow transition-all duration-500 group overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-secondary/20 text-secondary border-none">{job.department}</Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">{job.type}</Badge>
                    </div>
                    <CardTitle className="text-3xl font-headline font-bold group-hover:text-primary transition-colors">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Dialog open={selectedJob?.id === job.id} onOpenChange={(open) => !open && setSelectedJob(null)}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-xl px-8 hidden md:flex font-bold" onClick={() => setSelectedJob(job)}>
                        Apply Now
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-none sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
                      <form onSubmit={handleApply}>
                        <DialogHeader className="space-y-4">
                          <DialogTitle className="text-3xl font-headline font-bold">Manifest Your Ambition</DialogTitle>
                          <DialogDescription className="text-base">
                            Apply for the <span className="text-secondary font-bold">{job.title}</span> position within the Baron's council.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input 
                              id="name" 
                              placeholder="Full Name" 
                              required 
                              className="bg-card h-12"
                              value={applicationData.name}
                              onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Preferred Contact</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="email@example.com" 
                              required 
                              className="bg-card h-12"
                              value={applicationData.email}
                              onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Resume / CV</Label>
                            <div 
                              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors cursor-pointer ${resumeBase64 ? 'border-secondary bg-secondary/5' : 'border-border hover:border-primary/50'}`}
                              onClick={() => !resumeBase64 && fileInputRef.current?.click()}
                            >
                              {resumeBase64 ? (
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary/20 rounded-lg">
                                      <FileText className="h-5 w-5 text-secondary" />
                                    </div>
                                    <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Paperclip className="h-6 w-6 text-muted-foreground mb-2" />
                                  <span className="text-sm text-muted-foreground font-medium">Attach Visionary CV</span>
                                  <span className="text-[10px] text-muted-foreground uppercase mt-1">PDF or DOC (Max 2MB)</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Why the Baron?</Label>
                            <Textarea 
                              id="message" 
                              placeholder="Tell us about your vision..." 
                              required 
                              className="bg-card min-h-[100px] resize-none"
                              value={applicationData.message}
                              onChange={(e) => setApplicationData({ ...applicationData, message: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={isApplying} 
                            className="w-full h-14 bg-primary hover:bg-primary/90 font-bold text-lg crimson-glow"
                          >
                            {isApplying ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Submit Credentials</>}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {job.description}
                  </p>
                  <Button variant="link" className="text-secondary p-0 mt-4 md:hidden" onClick={() => setSelectedJob(job)}>
                    View Details & Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed border-2 border-border/50">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold font-headline">The Baron's Council is Currently Full</h3>
            <p className="text-muted-foreground max-w-md mx-auto mt-2">
              While we don't have open positions at this moment, excellence always finds a way. Send your credentials to <span className="text-secondary">registry@blubberbaron.com</span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
