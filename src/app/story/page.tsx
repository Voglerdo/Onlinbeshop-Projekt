
"use client"

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, History, Award, Users } from 'lucide-react';
import styles from './page.styles.module.css';

export default function StoryPage() {
  return (
    <div className={styles.storyLayoutPrimary}>
      <section className={styles.storySection}>
        <Image src="https://picsum.photos/seed/baron-heritage/1920/1080" alt="Das Erbe des Barons" fill priority className={styles.dasErbeDesBaronsImage} data-ai-hint="vintage luxury" />
        <div className={styles.overlay} />
        <div className={styles.storyContainerPrimary}>
          <Badge className={styles.etabliertInExzellenzBadge}>Etabliert in Exzellenz</Badge>
          <h1 className={styles.dieLegendeVomTitle}>DIE LEGENDE VOM <br /><span className={styles.dieLegendeVomTitle2}>BARON</span></h1>
          <div className={styles.storyLayoutSecondary}>
            <p className={styles.bodyText}>"Eine Session ist nicht bloß Rauch; sie ist ein Gespräch zwischen der Seele und den Sinnen."</p>
          </div>
        </div>
      </section>

      <section className={styles.storySection2}>
        <div className={styles.grid}>
          <div className={styles.storyContainerTertiary}>
            <div className={styles.storyContainerSecondary}>
              <h2 className={styles.eineVisionDerRaffinesseHeading}>Eine Vision der Raffinesse</h2>
              <div className={styles.storyDivider} />
            </div>
            <p className={styles.bodyText2}>Blubber Baron wurde aus einer einzigen Besessenheit geboren: das Alltägliche abzustreifen und das Shisha-Erlebnis zu einer Kunstform zu erheben.</p>
            <div className={styles.grid2}>
              <div className={styles.storyFeature}>
                <div className={styles.storyLayoutTertiary}><History className={styles.storyIconPrimary} /> Erbe</div>
                <p className={styles.bodyText3}>Jahrzehntelange Expertise in Fluiddynamik und Materialwissenschaft.</p>
              </div>
              <div className={styles.storyFeature}>
                <div className={styles.storyLayoutTertiary}><Award className={styles.storyIconPrimary} /> Qualität</div>
                <p className={styles.bodyText3}>Wir verwenden nur feinstes medizinisches Silikon und Stahl in Luftfahrtqualität.</p>
              </div>
            </div>
          </div>
          <div className={styles.storyPanelPrimary}>
            <Image src="/images/laborexperten.png" alt="Laborexperten" fill className={styles.handwerkskunstImage} data-ai-hint="labor experts" />
          </div>
        </div>
      </section>

      <section className={styles.storySection3}>
        <div className={styles.storyContainerSenary}>
          <Quote className={styles.quoteIcon} />
          <h2 className={styles.storyHeading}>"Der Baron glaubt, dass wahrer Luxus in der Stille eines perfekten Zugs und der Dichte einer Wolke zu spüren ist, die wie eine Erinnerung verweilt."</h2>
          <div className={styles.storyLayoutQuaternary}>
            <Star className={styles.starIcon} />
            <span className={styles.dasDekretDesBaronsText}>Das Dekret des Barons</span>
            <Star className={styles.starIcon} />
          </div>
        </div>
      </section>

      <section className={styles.storySection4}>
        <div className={styles.storyContainerSeptenary}>
          <h2 className={styles.unsereSaulenHeading}>Unsere Säulen</h2>
          <p className={styles.aufgebautAufDreiKernprinzipienText}>Aufgebaut auf drei Kernprinzipien.</p>
        </div>
        <div className={styles.grid3}>
          {[
            { icon: Users, title: "Gemeinschaft", text: "Austausch von Techniken, Aromen und dem Lebensstil, der die Wolke begleitet." },
            { icon: Star, title: "Innovation", text: "Ständiges Erweitern der Grenzen der Shisha-Technologie." },
            { icon: Award, title: "Reinheit", text: "Keine Zusätze, keine Abkürzungen. Nur die reinstmögliche Session." }
          ].map((item, i) => (
            <div key={i} className={styles.storyPanelSecondary}>
              <div className={styles.storyLayoutQuinary}>
                <item.icon className={styles.storyIconSecondary} />
              </div>
              <h3 className={styles.storyHeading2}>{item.title}</h3>
              <p className={styles.bodyText4}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

