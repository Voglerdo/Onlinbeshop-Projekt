
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
import styles from './page.styles.module.css';
import { cn } from '@/lib/utils';

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
    <div className={styles.careersLayoutPrimary}>
      {/* Hero Section */}
      <section className={styles.careersSection}>
        <Image
          src="https://picsum.photos/seed/baron-careers/1920/1080"
          alt="Werden Sie Teil der Baron-Elite"
          fill
          priority
          className={styles.careersUtilityPrimary}
          data-ai-hint="luxury office"
        />
        <div className={styles.overlay} />
        
        <div className={styles.careersContainerPrimary}>
          <Badge className={styles.demImperiumBeitretenBadge}>DEM IMPERIUM BEITRETEN</Badge>
          <h1 className={styles.careersTitle}>
            DIE ZUKUNFT <br /><span className={styles.careersLineBreakPrimary}>GESTALTEN</span>
          </h1>
          <p className={styles.bodyText}>
            Bei Blubber Baron bieten wir nicht nur Jobs an; wir bieten einen Platz am Tisch für Luxus und Innovation.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.careersSection2}>
        <div className={styles.grid}>
          <div className={styles.careersPanelPrimary}>
            <Image 
              src="https://picsum.photos/seed/baron-culture/1000/750" 
              alt="Unsere Kultur" 
              fill 
              className={styles.careersUtilitySecondary}
              data-ai-hint="team luxury"
            />
          </div>
          <div className={styles.careersContainerSecondary}>
            <div className={styles.careersContainerTertiary}>
              <h2 className={styles.derInnereKreisDesBaronsHeading}>Der innere Kreis des Barons</h2>
              <div className={styles.careersContainerQuaternary} />
            </div>
            <p className={styles.bodyText2}>
              Wir sind ein Kollektiv von Designern, Visionären und Shisha-Aficionados, die sich der Neudefinition der Branchenstandards verschrieben haben.
            </p>
            <div className={styles.careersContainerTertiary}>
              {[
                "Globale Netzwerkmöglichkeiten mit Luxusmarken.",
                "Zugang zu den exklusiven Forschungs- und Entwicklungslaboren des Barons.",
                "Ein kollaboratives Umfeld, das ästhetische Präzision schätzt."
              ].map((benefit, i) => (
                <div key={i} className={styles.careersLayoutSecondary}>
                  <div className={styles.careersPanelSecondary} />
                  <span className={styles.inlineText}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className={styles.careersSection3}>
        <div className={styles.careersLayoutTertiary}>
          <div className={styles.careersContainerQuinary}>
            <div className={styles.careersLayoutQuaternary}>
              <Sparkles className={styles.sparklesIcon} />
              Offene Positionen
            </div>
            <h2 className={styles.aktuelleChancenHeading}>Aktuelle Chancen</h2>
          </div>
          <Badge variant="outline" className={styles.statusBadge}>
            {isLoading ? '...' : (jobs?.length || 0)} Möglichkeiten
          </Badge>
        </div>

        {isLoading ? (
          <div className={styles.careersLayoutQuinary}>
            <Loader2 className={styles.loader2Icon} />
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className={styles.grid2}>
            {jobs.map((job) => (
              <Card key={job.id} className="glass-card border border-border/40 hover:gold-glow transition-all duration-500 group overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-secondary/20 text-secondary border-none">{job.department}</Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">{job.type}</Badge>
                    </div>
                    <CardTitle className={styles.careersTextPrimary}>
                      {job.title}
                    </CardTitle>
                    <div className={styles.careersLayoutSeptenary}>
                      <MapPin className={styles.careersIconPrimary} />
                      {job.location}
                      <Clock className="h-4 w-4 text-primary ml-4" />
                      Gepostet am {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Dialog open={selectedJob?.id === job.id} onOpenChange={(open) => !open && setSelectedJob(null)}>
                    <DialogTrigger asChild>
                      <Button size="lg" className={styles.actionButton} onClick={() => setSelectedJob(job)}>
                        Jetzt bewerben
                        <ChevronRight className={styles.careersIconTertiary} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={styles.careersDialogPrimary}>
                      <form onSubmit={handleApply}>
                        <DialogHeader className={styles.careersContainerTertiary}>
                          <DialogTitle className={styles.careersTextSecondary}>Manifestieren Sie Ihren Ehrgeiz</DialogTitle>
                          <DialogDescription className={styles.careersDialogSecondary}>
                            Bewerben Sie sich für die Position als <span className={styles.inlineText2}>{job.title}</span> im Rat des Barons.
                          </DialogDescription>
                        </DialogHeader>
                        <div className={styles.careersContainerSeptenary}>
                          <div className={styles.careersContainerSenary}>
                            <Label htmlFor="name">Ihr Name</Label>
                            <Input 
                              id="name" 
                              placeholder="Vollständiger Name" 
                              required 
                              className={styles.careersUtilityTertiary}
                              value={applicationData.name}
                              onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                            />
                          </div>
                          <div className={styles.careersContainerSenary}>
                            <Label htmlFor="email">Bevorzugte Kontakt-E-Mail</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="email@beispiel.de" 
                              required 
                              className={styles.careersUtilityTertiary}
                              value={applicationData.email}
                              onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                            />
                          </div>
                          
                          <div className={styles.careersContainerSenary}>
                            <Label>Lebenslauf / Portfolio</Label>
                            <div 
                              className={cn(
                                styles.resumeDropzone,
                                resumeBase64
                                  ? styles.resumeDropzoneSelected
                                  : styles.resumeDropzoneEmpty,
                              )}
                              onClick={() => !resumeBase64 && fileInputRef.current?.click()}
                            >
                              {resumeBase64 ? (
                                <div className={styles.careersLayoutOctonary}>
                                  <div className={styles.careersLayoutSecondary}>
                                    <div className={styles.careersPanelTertiary}>
                                      <FileText className={styles.careersIconQuaternary} />
                                    </div>
                                    <span className={styles.inlineText3}>{fileName}</span>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                                    <X className={styles.xIcon} />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Paperclip className={styles.paperclip54} />
                                  <span className={styles.visionarenLebenslaufAnhangenText}>Visionären Lebenslauf anhängen</span>
                                  <span className={styles.pdfOderDocMax2mbText}>PDF oder DOC (Max 2MB)</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                className={styles.careersUtilityQuaternary} 
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>

                          <div className={styles.careersContainerSenary}>
                            <Label htmlFor="message">Warum der Baron?</Label>
                            <Textarea 
                              id="message" 
                              placeholder="Erzählen Sie uns von Ihrer Vision..." 
                              required 
                              className={styles.careersUtilityQuinary}
                              value={applicationData.message}
                              onChange={(e) => setApplicationData({ ...applicationData, message: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={isApplying} 
                            className={styles.careersTextTertiary}
                          >
                            {isApplying ? <Loader2 className={styles.loader2Icon2} /> : <><Send className={styles.loader2Icon3} /> Bewerbung einreichen</>}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="max-w-4xl space-y-6">
                    <p className="whitespace-pre-line text-muted-foreground leading-8">
                      {job.description}
                    </p>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="rounded-2xl border border-border/60 bg-background/35 p-5">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-secondary">Anforderungen</h3>
                        <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                          {job.requirements.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button variant="link" className="text-secondary p-0 mt-4 md:hidden" onClick={() => setSelectedJob(job)}>
                    Details ansehen & bewerben
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={styles.careersPanelQuaternary}>
            <Briefcase className={styles.briefcaseIcon} />
            <h3 className={styles.derRatDesBaronsIstDerzeitVollzahligHeading}>Der Rat des Barons ist derzeit vollzählig</h3>
            <p className={styles.bodyText4}>
              Auch wenn wir momentan keine offenen Stellen haben, findet Exzellenz immer einen Weg. Senden Sie Ihre Initiativbewerbung an <span className={styles.careersLineBreakPrimary}>register@blubberbaron.de</span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}


