
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, History, Award, Users, Play, Loader2, Volume2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { storyTTS } from '@/ai/flows/story-tts-flow';
import { useToast } from '@/hooks/use-toast';

export default function StoryPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleListen = async () => {
    if (audioUrl) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
      return;
    }

    setIsLoadingAudio(true);
    try {
      const philosophyText = "The Baron believes that true luxury is felt in the silence of a perfect draw and the density of a cloud that lingers like a memory. A session is not merely smoke; it is a conversation between the soul and the senses.";
      const result = await storyTTS({ text: philosophyText });
      setAudioUrl(result.audioUri);
      
      // Auto play after load
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    } catch (e) {
      toast({ title: "Voice Manifestation Failed", variant: "destructive" });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image src="https://picsum.photos/seed/baron-heritage/1920/1080" alt="The Baron's Heritage" fill priority className="object-cover opacity-40 grayscale-[0.5]" data-ai-hint="vintage luxury" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="container relative z-10 px-4 text-center space-y-6">
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 px-6 py-1 text-xs tracking-[0.3em] font-bold uppercase">Established in Excellence</Badge>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none">THE LEGEND OF <br /><span className="text-primary">THE BARON</span></h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic">"A session is not merely smoke; it is a conversation between the soul and the senses."</p>
            <Button 
              variant="outline" 
              onClick={handleListen} 
              disabled={isLoadingAudio}
              className="mt-4 border-secondary text-secondary hover:bg-secondary/10 rounded-full px-8 h-12 gold-glow"
            >
              {isLoadingAudio ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : isPlaying ? <Volume2 className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isLoadingAudio ? "Summoning Voice..." : isPlaying ? "Pause the Baron" : "Listen to the Decree"}
            </Button>
            {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">A Vision of Sophistication</h2>
              <div className="h-1 w-24 bg-primary" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">Blubber Baron was born from a singular obsession: to strip away the mundane and elevate the shisha experience into an art form.</p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs"><History className="h-5 w-5" /> Heritage</div>
                <p className="text-sm text-muted-foreground">Decades of combined expertise in fluid dynamics and material science.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs"><Award className="h-5 w-5" /> Quality</div>
                <p className="text-sm text-muted-foreground">Sourcing only the finest medical-grade silicone and aerospace-grade steel.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden glass-card gold-glow border-none">
            <Image src="https://picsum.photos/seed/baron-craft/1000/1000" alt="Craftsmanship" fill className="object-cover" data-ai-hint="shisha craftsmanship" />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-24 border-y border-border/50">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-12">
          <Quote className="h-16 w-16 text-primary/20 mx-auto" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold leading-tight">"The Baron believes that true luxury is felt in the silence of a perfect draw and the density of a cloud that lingers like a memory."</h2>
          <div className="flex items-center justify-center gap-2 text-secondary">
            <Star className="fill-secondary h-4 w-4" />
            <span className="font-bold tracking-[0.4em] text-sm uppercase">The Baron's Decree</span>
            <Star className="fill-secondary h-4 w-4" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-headline font-bold">Our Pillars</h2>
          <p className="text-muted-foreground">Built on the foundation of three core principles.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Users, title: "Community", text: "Sharing techniques, flavors, and the lifestyle that accompanies the cloud." },
            { icon: Star, title: "Innovation", text: "Constantly pushing the boundaries of shisha technology." },
            { icon: Award, title: "Purity", text: "No additives, no shortcuts. Just the cleanest session possible." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-10 rounded-3xl text-center group hover:gold-glow transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-headline mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
