"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, History, Award, Users } from "lucide-react";
import styles from "./page.styles.module.css";

export default function StoryPage() {
  return (
    <div className={styles.storyLayoutPrimary}>
      <section className={styles.storySection}>
        <Image
          src="https://picsum.photos/seed/baron-heritage/1920/1080"
          alt="Das Erbe des Barons"
          fill
          priority
          className={styles.dasErbeDesBaronsImage}
          data-ai-hint="vintage luxury"
        />
        <div className={styles.overlay} />
        <div className={styles.storyContainerPrimary}>
          <Badge className={styles.etabliertInExzellenzBadge}>
            GEPRÄGT VON QUALITÄT
          </Badge>
          <h1 className={styles.dieLegendeVomTitle}>
            DIE GESCHICHTE DES <br />
            <span className={styles.dieLegendeVomTitle2}>BARONS</span>
          </h1>
          <div className={styles.storyLayoutSecondary}>
            <p className={styles.bodyText}>
              "Eine Session ist nicht bloß Rauch; sie ist ein Gespräch zwischen
              der Seele und den Sinnen."
            </p>
          </div>
        </div>
      </section>

      <section className={styles.storySection2}>
        <div className={styles.grid}>
          <div className={styles.storyContainerTertiary}>
            <div className={styles.storyContainerSecondary}>
              <h2 className={styles.eineVisionDerRaffinesseHeading}>
                AUS LEIDENSCHAFT ENTSTANDEN
              </h2>
              <div className={styles.storyDivider} />
            </div>
            <p className={styles.bodyText2}>
              Hinter Blubber Baron stehen Menschen mit einer gemeinsamen
              Leidenschaft: Produkte zu entwickeln, die Qualität, Design und
              Genuss miteinander verbinden.
            </p>
            <div className={styles.grid2}>
              <div className={styles.storyFeature}>
                <div className={styles.storyLayoutTertiary}>
                  <History className={styles.storyIconPrimary} /> Innovation
                </div>
                <p className={styles.bodyText3}>
                  Moderne Ideen treffen auf hochwertiges Handwerk.
                </p>
              </div>
              <div className={styles.storyFeature}>
                <div className={styles.storyLayoutTertiary}>
                  <Award className={styles.storyIconPrimary} /> Qualität
                </div>
                <p className={styles.bodyText3}>
                  Wir entwickeln Produkte, die durch Qualität und Langlebigkeit
                  überzeugen.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.storyPanelPrimary}>
            <Image
              src="/images/laborexperten.png"
              alt="Laborexperten"
              fill
              className={styles.handwerkskunstImage}
              data-ai-hint="labor experts"
            />
          </div>
        </div>
      </section>

      <section className={styles.storySection3}>
        <div className={styles.storyContainerSenary}>
          <Quote className={styles.quoteIcon} />
          <h2 className={styles.storyHeading}>
            "Der Baron glaubt, dass die wertvollsten Momente nicht gekauft
            werden können. Sie entstehen, wenn gute Freunde zusammenkommen,
            Gespräche ihren Lauf nehmen und aus einer einfachen Session eine
            Erinnerung wird, die noch lange nach der letzten Wolke bleibt."
          </h2>
          <div className={styles.storyLayoutQuaternary}>
            <Star className={styles.starIcon} />
            <span className={styles.dasDekretDesBaronsText}>
              Das Dekret des Barons
            </span>
            <Star className={styles.starIcon} />
          </div>
        </div>
      </section>

      <section className={styles.storySection4}>
        <div className={styles.storyContainerSeptenary}>
          <h2 className={styles.unsereSaulenHeading}>Unsere Säulen</h2>
          <p className={styles.aufgebautAufDreiKernprinzipienText}>
            Aufgebaut auf drei Kernprinzipien.
          </p>
        </div>
        <div className={styles.grid3}>
          {[
            {
              icon: Users,
              title: "Gemeinschaft",
              text: "Momente, die verbinden.",
            },
            {
              icon: Star,
              title: "Innovation",
              text: "Ideen, die begeistern.",
            },
            {
              icon: Award,
              title: "Qualität",
              text: "Standards ohne Kompromisse.",
            },
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
