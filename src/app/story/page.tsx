"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, History, Award, Users } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Narrative Hero */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/baron-heritage/1920/1080"
          alt="The Baron's Heritage"
          fill
          priority
          className="object-cover opacity-40 grayscale-[0.5]"
          data-ai-hint="vintage luxury"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="container relative z-10 px-4 text-center space-y-6">
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 px-6 py-1 text-xs tracking-[0.3em] font-bold">ESTABLISHED IN EXCELLENCE</Badge>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none">
            THE LEGEND OF <br /><span className="text-primary">THE BARON</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic">
            "A session is not merely smoke; it is a conversation between the soul and the senses."
          </p>
        </div>
      </section>

      {/* The Origin Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">A Vision of Sophistication</h2>
              <div className="h-1 w-24 bg-primary" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Blubber Baron was born from a singular obsession: to strip away the mundane and elevate the shisha experience into an art form. What began as a private collection of rare hookahs across the Mediterranean evolved into a global standard for luxury.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We don't just sell equipment; we curate moments. Every piece in our collection—from the hand-blown crystal bases to our proprietary coconut charcoal—is tested against the Baron's uncompromising standards for airflow, heat retention, and aesthetic grandeur.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <History className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Heritage</span>
                </div>
                <p className="text-sm text-muted-foreground">Decades of combined expertise in fluid dynamics and material science.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Award className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Quality</span>
                </div>
                <p className="text-sm text-muted-foreground">Sourcing only the finest medical-grade silicone and aerospace-grade steel.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden glass-card gold-glow border-none">
            <Image 
              src="https://picsum.photos/seed/baron-craft/1000/1000" 
              alt="Craftsmanship" 
              fill 
              className="object-cover"
              data-ai-hint="shisha craftsmanship"
            />
          </div>
        </div>
      </section>

      {/* The Philosophy Banner */}
      <section className="bg-muted/30 py-24 border-y border-border/50">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-12">
          <Quote className="h-16 w-16 text-primary/20 mx-auto" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold leading-tight">
            "The Baron believes that true luxury is felt in the silence of a perfect draw and the density of a cloud that lingers like a memory."
          </h2>
          <div className="flex items-center justify-center gap-2 text-secondary">
            <Star className="fill-secondary h-4 w-4" />
            <span className="font-bold tracking-[0.4em] text-sm uppercase">The Baron's Decree</span>
            <Star className="fill-secondary h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Team/Values Section */}
      <section className="container mx-auto px-4 lg:px-8 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-headline font-bold">Our Pillars</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Built on the foundation of three core principles that define every Blubber Baron encounter.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="glass-card p-10 rounded-3xl space-y-6 text-center group hover:gold-glow transition-all duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-headline">Community</h3>
            <p className="text-muted-foreground leading-relaxed">We foster a global circle of connoisseurs, sharing techniques, flavors, and the lifestyle that accompanies the cloud.</p>
          </div>

          <div className="glass-card p-10 rounded-3xl space-y-6 text-center group hover:gold-glow transition-all duration-500">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-secondary/20 transition-colors">
              <Star className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold font-headline">Innovation</h3>
            <p className="text-muted-foreground leading-relaxed">Our labs constantly push the boundaries of shisha technology, from diffuser silence to thermal flavor preservation.</p>
          </div>

          <div className="glass-card p-10 rounded-3xl space-y-6 text-center group hover:gold-glow transition-all duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-headline">Purity</h3>
            <p className="text-muted-foreground leading-relaxed">No additives, no shortcuts. Whether it's our coals or our flavors, we prioritize the cleanest session possible.</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="relative p-12 lg:p-20 glass-card rounded-[3rem] overflow-hidden crimson-glow border-none text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-black">BECOME PART OF THE STORY</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">The Baron is waiting. Your next masterpiece session begins with a single selection.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-xl">
              <Link href="/#catalog">Browse Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary/10 h-14 px-10 rounded-xl">
              <Link href="/profile">Join the Registry</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
