
"use client"

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { JobOffer } from '@/app/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, MapPin, Clock, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CareersPage() {
  const db = useFirestore();

  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: jobs, isLoading } = useCollection<JobOffer>(jobsQuery);

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
                  <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-xl px-8 hidden md:flex font-bold">
                    Apply Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {job.description}
                  </p>
                  <Button variant="link" className="text-secondary p-0 mt-4 md:hidden">
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
