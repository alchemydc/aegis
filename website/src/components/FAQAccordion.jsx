import { useState } from 'react';

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex((current) => (current === idx ? -1 : idx));
  };

  return (
    <div className="rounded-xl border border-border-light bg-white px-5 py-2 dark:border-border-light/20 dark:bg-charcoal/50">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div key={item.question} className="border-b border-border-light last:border-b-0 dark:border-border-light/20">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-navy dark:text-white">{item.question}</span>
              <span className="text-xl leading-none text-cyan" aria-hidden="true">
                {isOpen ? '-' : '+'}
              </span>
            </button>

            <div className={isOpen ? 'pb-4 text-sm leading-6 text-gray-muted' : 'hidden'}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
