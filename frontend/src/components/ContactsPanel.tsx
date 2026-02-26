import React, { useState } from "react";
import { submitContact, type ContactFormData } from "../api";

type ContactItem = {
  id: string;
  label: string;
  value: string;
  href?: string;
  icon: string;
};

const CONTACTS: ContactItem[] = [
  {
    id: "email",
    label: "Email",
    value: "kanna@example.com",
    href: "mailto:kanna@example.com",
    icon: "✉"
  },
  {
    id: "phone",
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    icon: "📞"
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/kanna",
    href: "https://linkedin.com/in/kanna",
    icon: "in"
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/kanna",
    href: "https://github.com/kanna",
    icon: "⌘"
  },
  {
    id: "leetcode",
    label: "LeetCode",
    value: "leetcode.com/u/kanna",
    href: "https://leetcode.com/u/kanna",
    icon: "{}"
  },
  {
    id: "portfolio",
    label: "Portfolio",
    value: "View full portfolio",
    href: "#",
    icon: "◇"
  }
];

const initialForm: ContactFormData = { name: "", email: "", subject: "", message: "" };

export const ContactsPanel: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await submitContact(form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contacts-panel">
      <h2 className="panel-heading">Get in touch</h2>
      <p className="contacts-intro">
        Open to roles in full-stack, backend, and 3D/interactive dev. Reach out via any channel below or use the form.
      </p>
      <ul className="contacts-grid" role="list">
        {CONTACTS.map((c) => (
          <li key={c.id}>
            {c.href ? (
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="contact-card"
              >
                <span className="contact-icon">{c.icon}</span>
                <span className="contact-label">{c.label}</span>
                <span className="contact-value">{c.value}</span>
              </a>
            ) : (
              <div className="contact-card contact-card-static">
                <span className="contact-icon">{c.icon}</span>
                <span className="contact-label">{c.label}</span>
                <span className="contact-value">{c.value}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <section className="contact-form-section">
        <h3 className="contact-form-heading">Contact us</h3>
        {success ? (
          <p className="contact-form-success">Thank you! Your message has been sent. I&apos;ll get back to you soon.</p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="text-input"
                  autoComplete="name"
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="text-input"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="contact-form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Project inquiry"
                className="text-input"
                autoComplete="off"
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Your message..."
                className="text-input contact-form-textarea"
                rows={4}
              />
            </div>
            {error && <p className="contact-form-error">{error}</p>}
            <button type="submit" className="primary-button" disabled={sending}>
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
