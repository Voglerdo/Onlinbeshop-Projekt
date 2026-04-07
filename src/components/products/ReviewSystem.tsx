
"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2, User, Calendar, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { externalApiService } from '@/services/api-client';

interface ReviewSystemProps {
  productId: string;
}

export function ReviewSystem({ productId }: ReviewSystemProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      if (!productId) return;
      setIsLoading(true);
      try {
        const data = await externalApiService.getReviews(productId);
        setReviews(data);
      } catch (err) {
        console.error('Fehler beim Laden der Reviews:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Identifizierung erforderlich", description: "Bitte melden Sie sich an, um eine Bewertung abzugeben.", variant: "destructive" });
      return;
    }

    if (comment.trim().length < 5) {
      toast({ title: "Narrativ zu kurz", description: "Ihr Feedback muss mindestens 5 Zeichen lang sein.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const newReview = {
      productId,
      userId: user.uid,
      userName: user.firstName ? `${user.firstName} ${user.lastName}` : 'Anonymer Baron',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    try {
      const savedReview = await externalApiService.syncReview(newReview);
      setReviews([savedReview, ...reviews]);
      toast({ title: "Dekret erhalten", description: "Ihre Erfahrung wurde protokolliert." });
      setComment('');
      setRating(5);
    } catch (err) {
      toast({ title: "Fehler beim Senden", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-headline font-bold">Der Konsens</h2>
          <p className="text-muted-foreground font-medium">Stimmen aus dem inneren Kreis des Barons.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-black text-secondary">
              {reviews.length > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : "5.0"}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Imperiales Rating</div>
          </div>
          <div className="h-10 w-px bg-border" />
          <Badge variant="outline" className="h-10 px-4 border-border text-muted-foreground">
            {reviews.length} Dekrete
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1">
          <div className="glass-card p-8 rounded-3xl sticky top-24 space-y-8 border-none gold-glow">
            <h3 className="text-xl font-bold font-headline">Feedback manifestieren</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Qualitäts-Score</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-transform active:scale-90">
                      <Star className={cn("h-8 w-8 transition-colors duration-300", star <= rating ? "fill-secondary text-secondary" : "text-muted-foreground/30")} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="comment" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Narrativ</Label>
                <Textarea id="comment" placeholder="Beschreiben Sie Ihre Erfahrung..." className="bg-background/50 border-border min-h-[120px] resize-none" value={comment} onChange={(e) => setComment(e.target.value)} required />
              </div>
              <Button type="submit" disabled={isSubmitting || !user} className="w-full h-14 bg-primary hover:bg-primary/90 font-bold text-lg crimson-glow">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : !user ? "Anmelden für Review" : <><Send className="mr-2 h-5 w-5" /> Dekret veröffentlichen</>}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="group relative glass-card p-8 rounded-3xl border-none hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                        <User className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{review.userName}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex text-secondary">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("h-4 w-4", s <= review.rating ? "fill-secondary" : "text-muted-foreground/30")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-card rounded-[3rem] border-dashed border-2 border-border/50">
              <Star className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold font-headline">Keine Dekrete</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">Seien Sie der Erste, der dieses Meisterwerk bewertet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
