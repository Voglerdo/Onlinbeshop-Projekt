import Link from 'next/link';

import styles from './Footer.module.css';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { href: '/#catalog', label: 'Wasserpfeifen' },
      { href: '/#catalog', label: 'Kohle' },
      { href: '/#catalog', label: 'Tabak & Aromen' },
      { href: '/#catalog', label: 'Zubehoer' },
    ],
  },
  {
    title: 'Imperium',
    links: [
      { href: '/story', label: 'Unsere Geschichte' },
      { href: '/careers', label: 'Karriere' },
      { href: '/profile', label: 'Das Register' },
      { href: '/admin', label: 'Admin-Konsole' },
    ],
  },
  {
    title: 'Kontakt',
    links: [
      { href: '/', label: 'Instagram' },
      { href: '/', label: 'Twitter' },
      { href: '/', label: 'Facebook' },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandBlock}>
            <h3 className={styles.brandTitle}>BLUBBER BARON</h3>
            <p className={styles.description}>
              Exzellente Shisha-Erlebnisse fuer den anspruchsvollen Geniesser.
              Luxus, Leistung und Raffinesse in jedem Zug.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <ul className={styles.linkList}>
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Blubber Baron. Alle Rechte
          vorbehalten.
        </div>
      </div>
    </footer>
  );
}
