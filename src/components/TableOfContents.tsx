import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Quick Navigation
      </h2>
      <ul className="space-y-3">
        {sections.map((section) => (
          <motion.li
            key={section.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <a
              href={`#${section.id}`}
              className={`block py-1 text-sm transition-colors duration-200 ${
                activeSection === section.id
                  ? 'text-amber-600 dark:text-amber-400 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(section.id)?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              {section.title}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
