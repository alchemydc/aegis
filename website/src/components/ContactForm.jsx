import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent('Aegis website inquiry');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:hello@aegis.dev?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border-light bg-white p-6 dark:border-border-light/20 dark:bg-charcoal/50">
      <div>
        <label className="mb-2 block text-sm font-medium text-navy dark:text-white" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-slate outline-none focus:border-cyan dark:border-border-light/20 dark:bg-charcoal dark:text-off-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-navy dark:text-white" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-slate outline-none focus:border-cyan dark:border-border-light/20 dark:bg-charcoal dark:text-off-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-navy dark:text-white" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          required
          className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-slate outline-none focus:border-cyan dark:border-border-light/20 dark:bg-charcoal dark:text-off-white"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-cyan px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:shadow-[0_0_20px_rgba(0,217,255,0.35)]"
      >
        Send Message
      </button>
    </form>
  );
}
