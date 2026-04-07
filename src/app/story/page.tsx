
"use client"

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, History, Award, Users } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image src="https://picsum.photos/seed/baron-heritage/1920/1080" alt="Das Erbe des Barons" fill priority className="object-cover opacity-40 grayscale-[0.5]" data-ai-hint="vintage luxury" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="container relative z-10 px-4 text-center space-y-6">
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 px-6 py-1 text-xs tracking-[0.3em] font-bold uppercase">Etabliert in Exzellenz</Badge>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none">DIE LEGENDE VOM <br /><span className="text-primary">BARON</span></h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic">"Eine Session ist nicht bloß Rauch; sie ist ein Gespräch zwischen der Seele und den Sinnen."</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Eine Vision der Raffinesse</h2>
              <div className="h-1 w-24 bg-primary" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">Blubber Baron wurde aus einer einzigen Besessenheit geboren: das Alltägliche abzustreifen und das Shisha-Erlebnis zu einer Kunstform zu erheben.</p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs"><History className="h-5 w-5" /> Erbe</div>
                <p className="text-sm text-muted-foreground">Jahrzehntelange Expertise in Fluiddynamik und Materialwissenschaft.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs"><Award className="h-5 w-5" /> Qualität</div>
                <p className="text-sm text-muted-foreground">Wir verwenden nur feinstes medizinisches Silikon und Stahl in Luftfahrtqualität.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden glass-card gold-glow border-none">
            <Image src="https://picsum.photos/seed/baron-craft/1000/1000" alt="Handwerkskunst" fill className="object-cover" data-ai-hint="shisha craftsmanship" />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-24 border-y border-border/50">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-12">
          <Quote className="h-16 w-16 text-primary/20 mx-auto" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold leading-tight">"Der Baron glaubt, dass wahrer Luxus in der Stille eines perfekten Zugs und der Dichte einer Wolke zu spüren ist, die wie eine Erinnerung verweilt."</h2>
          <div className="flex items-center justify-center gap-2 text-secondary">
            <Star className="fill-secondary h-4 w-4" />
            <span className="font-bold tracking-[0.4em] text-sm uppercase">Das Dekret des Barons</span>
            <Star className="fill-secondary h-4 w-4" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-headline font-bold">Unsere Säulen</h2>
          <p className="text-muted-foreground">Aufgebaut auf drei Kernprinzipien.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Users, title: "Gemeinschaft", text: "Austausch von Techniken, Aromen und dem Lebensstil, der die Wolke begleitet." },
            { icon: Star, title: "Innovation", text: "Ständiges Erweitern der Grenzen der Shisha-Technologie." },
            { icon: Award, title: "Reinheit", text: "Keine Zusätze, keine Abkürzungen. Nur die reinstmögliche Session." }
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
