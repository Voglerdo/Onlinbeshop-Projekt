
"use client"

import { useState, useRef, useEffect } from 'react';
import { JobOffer } from '@/app/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { externalApiService } from '@/services/api-client';

export default function CareersPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      try {
        const data = await externalApiService.getJobs();
        setJobs(data);
      } catch (err) {
        console.error('Fehler beim Laden der Jobs:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "Datei zu groß", description: "Bitte stellen Sie ein Dokument bereit, das kleiner als 2MB ist.", variant: "destructive" });
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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsApplying(true);
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

    try {
      await externalApiService.syncApplication(application);
      toast({
        title: "Referenzen erhalten",
        description: "Der Rat des Barons wird Ihre Vision in Kürze prüfen.",
      });
      setApplicationData({ name: '', email: '', message: '' });
      setResumeBase64(null);
      setFileName(null);
      setSelectedJob(null);
    } catch (err) {
      toast({
        title: "Übermittlung fehlgeschlagen",
        description: "Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/baron-careers/1920/1080"
          alt="Werden Sie Teil der Baron-Elite"
          fill
          priority
          className="object-cover opacity-30 grayscale-[0.3]"
          data-ai-hint="luxury office"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="container relative z-10 px-4 text-center space-y-6">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-1 text-xs tracking-[0.3em] font-bold">DEM IMPERIUM BEITRETEN</Badge>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none">
            DIE ZUKUNFT <br /><span className="text-secondary">GESTALTEN</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Bei Blubber Baron bieten wir nicht nur Jobs an; wir bieten einen Platz am Tisch für Luxus und Innovation.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden glass-card gold-glow border-none">
            <Image 
              src="https://picsum.photos/seed/baron-culture/1000/750" 
              alt="Unsere Kultur" 
              fill 
              className="object-cover"
              data-ai-hint="team luxury"
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Der innere Kreis des Barons</h2>
              <div className="h-1 w-24 bg-secondary" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Wir sind ein Kollektiv von Designern, Visionären und Shisha-Aficionados, die sich der Neudefinition der Branchenstandards verschrieben haben.
            </p>
            <div className="space-y-4">
              {[
                "Globale Netzwerkmöglichkeiten mit Luxusmarken.",
                "Zugang zu den exklusiven Forschungs- und Entwicklungslaboren des Barons.",
                "Ein kollaboratives Umfeld, das ästhetische Präzision schätzt."
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
            <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-[0.4em] text-[10px]">
              <Sparkles className="h-3 w-3" />
              Offene Positionen
            </div>
            <h2 className="text-4xl font-headline font-bold">Aktuelle Chancen</h2>
          </div>
          <Badge variant="outline" className="text-muted-foreground border-border px-4 py-1">
            {isLoading ? '...' : (jobs?.length || 0)} Möglichkeiten
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
                      <MapPin className="h-4 w-4 text-primary" />
                      {job.location}
                      <Clock className="h-4 w-4 text-primary ml-4" />
                      Gepostet am {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Dialog open={selectedJob?.id === job.id} onOpenChange={(open) => !open && setSelectedJob(null)}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-xl px-8 hidden md:flex font-bold" onClick={() => setSelectedJob(job)}>
                        Jetzt bewerben
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-none sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
                      <form onSubmit={handleApply}>
                        <DialogHeader className="space-y-4">
                          <DialogTitle className="text-3xl font-headline font-bold">Manifestieren Sie Ihren Ehrgeiz</DialogTitle>
                          <DialogDescription className="text-base">
                            Bewerben Sie sich für die Position als <span className="text-secondary font-bold">{job.title}</span> im Rat des Barons.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Ihr Name</Label>
                            <Input 
                              id="name" 
                              placeholder="Vollständiger Name" 
                              required 
                              className="bg-card h-12"
                              value={applicationData.name}
                              onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Bevorzugte Kontakt-E-Mail</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="email@beispiel.de" 
                              required 
                              className="bg-card h-12"
                              value={applicationData.email}
                              onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Lebenslauf / Portfolio</Label>
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
                                  <span className="text-sm text-muted-foreground font-medium">Visionären Lebenslauf anhängen</span>
                                  <span className="text-[10px] text-muted-foreground uppercase mt-1">PDF oder DOC (Max 2MB)</span>
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
                            <Label htmlFor="message">Warum der Baron?</Label>
                            <Textarea 
                              id="message" 
                              placeholder="Erzählen Sie uns von Ihrer Vision..." 
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
                            {isApplying ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Bewerbung einreichen</>}
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
                    Details ansehen & bewerben
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed border-2 border-border/50">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold font-headline">Der Rat des Barons ist derzeit vollzählig</h3>
            <p className="text-muted-foreground max-w-md mx-auto mt-2">
              Auch wenn wir momentan keine offenen Stellen haben, findet Exzellenz immer einen Weg. Senden Sie Ihre Initiativbewerbung an <span className="text-secondary">register@blubberbaron.de</span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
