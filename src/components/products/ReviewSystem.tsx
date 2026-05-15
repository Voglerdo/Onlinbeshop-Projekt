
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
import styles from './ReviewSystem.styles.module.css';

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
    <div className={styles.productsReviewsystemContainerPrimary}>
      <div className={styles.productsReviewsystemLayoutPrimary}>
        <div className={styles.productsReviewsystemContainerSecondary}>
          <h2 className={styles.derKonsensHeading}>Der Konsens</h2>
          <p className={styles.stimmenAusDemInnerenKreisDesBaronsText}>Stimmen aus dem inneren Kreis des Barons.</p>
        </div>
        <div className={styles.productsReviewsystemLayoutSecondary}>
          <div className={styles.productsReviewsystemContainerTertiary}>
            <div className={styles.productsReviewsystemTextPrimary}>
              {reviews.length > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : "5.0"}
            </div>
            <div className={styles.productsReviewsystemTextSecondary}>Imperiales Rating</div>
          </div>
          <div className={styles.productsReviewsystemContainerQuaternary} />
          <Badge variant="outline" className={styles.statusBadge}>
            {reviews.length} Dekrete
          </Badge>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.productsReviewsystemContainerQuinary}>
          <div className={styles.productsReviewsystemPanelPrimary}>
            <h3 className={styles.feedbackManifestierenHeading}>Feedback manifestieren</h3>
            <form onSubmit={handleSubmitReview} className={styles.form}>
              <div className={styles.productsReviewsystemContainerSecondary}>
                <Label className={styles.productsReviewsystemIconPrimary}>Qualitäts-Score</Label>
                <div className={styles.productsReviewsystemLayoutTertiary}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className={styles.button19}>
                      <Star className={cn(styles.starIcon2, star <= rating ? styles.starIcon3 : styles.starIcon4)} />
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.productsReviewsystemContainerSecondary}>
                <Label htmlFor="comment" className={styles.productsReviewsystemIconPrimary}>Narrativ</Label>
                <Textarea id="comment" placeholder="Beschreiben Sie Ihre Erfahrung..." className={styles.textarea20} value={comment} onChange={(e) => setComment(e.target.value)} required />
              </div>
              <Button type="submit" disabled={isSubmitting || !user} className={styles.actionButton}>
                {isSubmitting ? <Loader2 className={styles.loader2Icon} /> : !user ? "Anmelden für Review" : <><Send className={styles.loader2Icon2} /> Dekret veröffentlichen</>}
              </Button>
            </form>
          </div>
        </div>

        <div className={styles.productsReviewsystemContainerSenary}>
          {isLoading ? (
            <div className={styles.productsReviewsystemLayoutQuaternary}><Loader2 className={styles.productsReviewsystemContainerSeptenary} /></div>
          ) : reviews.length > 0 ? (
            <div className={styles.grid2}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.productsReviewsystemPanelSecondary}>
                  <div className={styles.productsReviewsystemLayoutQuinary}>
                    <div className={styles.productsReviewsystemLayoutSecondary}>
                      <div className={styles.productsReviewsystemLayoutSenary}>
                        <User className={styles.user31} />
                      </div>
                      <div>
                        <div className={styles.productsReviewsystemTextTertiary}>{review.userName}</div>
                        <div className={styles.productsReviewsystemIconSecondary}>
                          <Calendar className={styles.calendar34} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={styles.productsReviewsystemLayoutSeptenary}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn(styles.starIcon5, s <= review.rating ? styles.starIcon6 : styles.starIcon4)} />
                      ))}
                    </div>
                  </div>
                  <p className={styles.bodyText}>"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.productsReviewsystemPanelTertiary}>
              <Star className={styles.starIcon} />
              <h3 className={styles.keineDekreteHeading}>Keine Dekrete</h3>
              <p className={styles.bodyText2}>Seien Sie der Erste, der dieses Meisterwerk bewertet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
