'use client';

import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information', label: 'Information We Collect' },
  { id: 'recommendation-data', label: 'How Recommendation Data Is Used' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'security', label: 'Security' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'contact', label: 'Contact Information' },
];

function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#091020]/45 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_40px_rgba(0,210,255,0.05)]"
    >
      <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h2>
      <div className="space-y-4 text-[15px] leading-7 text-white/72">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00d2ff] flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offsetTop = element.offsetTop - 96;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative z-10">
      <SiteHeader />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#00d2ff]/70 font-semibold mb-3">
              Privacy & Data Use
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-white/55 text-base md:text-lg leading-relaxed">
              WeMovies AI is designed to give you movie recommendations without
              requiring an account, payment information, or a persistent
              personal profile. This policy explains what data is processed,
              why it is used, and how it flows through the current production
              architecture.
            </p>
            <p className="text-white/35 text-sm mt-4">Last updated: June 2026</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-white/10 bg-[#091020]/55 backdrop-blur-sm p-6 shadow-[0_0_40px_rgba(0,210,255,0.05)]">
                <h2 className="text-white font-semibold mb-2 text-lg tracking-tight">
                  On this page
                </h2>
                <p className="text-white/40 text-sm leading-6 mb-5">
                  A plain-English overview of how WeMovies AI handles
                  recommendation inputs, contact messages, and third-party
                  integrations.
                </p>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? 'text-[#00d2ff] bg-[#00d2ff]/10 font-medium border border-[#00d2ff]/15'
                          : 'text-white/55 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-8 space-y-8">
              <SectionCard id="introduction" title="Introduction">
                <p>
                  WeMovies AI is a movie recommendation application built with a{' '}
                  <strong className="text-white">Next.js frontend</strong> and a{' '}
                  <strong className="text-white">FastAPI backend</strong>. The
                  service helps users discover movies by analyzing temporary
                  preference inputs — specifically the three movies a user rates
                  during a recommendation session.
                </p>
                <p>
                  The product currently does{' '}
                  <strong className="text-white">not include user accounts</strong>,{' '}
                  <strong className="text-white">payments</strong>, or a
                  long-term personal profile system. Our goal is to keep the
                  experience lightweight while still being transparent about how
                  data is processed in production.
                </p>
              </SectionCard>

              <SectionCard
                id="information"
                title="Information We Collect"
              >
                <BulletList
                  items={[
                    <>
                      <strong className="text-white">Recommendation inputs.</strong>{' '}
                      When you use the recommendation feature, the app sends the
                      three movies you select and the reactions you assign to
                      them (for example, “loved it” or “dislike”).
                    </>,
                    <>
                      <strong className="text-white">Contact form details.</strong>{' '}
                      If you submit the contact form, we process the name, email
                      address, subject, message, and submission timestamp needed
                      to respond to your inquiry.
                    </>,
                    <>
                      <strong className="text-white">Basic technical request data.</strong>{' '}
                      Like most deployed web applications, our hosting and API
                      infrastructure may process operational data such as IP
                      address, request metadata, browser information, and server
                      logs for delivery, debugging, uptime, and abuse prevention.
                    </>,
                    <>
                      <strong className="text-white">We do not collect account or payment data.</strong>{' '}
                      There is currently no sign-in system, subscription system,
                      checkout flow, or stored billing information in WeMovies
                      AI.
                    </>,
                  ]}
                />
              </SectionCard>

              <SectionCard
                id="recommendation-data"
                title="How Recommendation Data Is Used"
              >
                <p>
                  Recommendation inputs are used only to generate results for the
                  current session. The frontend sends your selected movie IDs to
                  the FastAPI backend, which runs inference using a hybrid
                  recommendation model and returns a ranked list of movie
                  suggestions.
                </p>
                <BulletList
                  items={[
                    <>
                      selected movie IDs are matched to the backend catalog for
                      inference,
                    </>,
                    <>
                      the recommendation engine combines collaborative and
                      content-based signals,
                    </>,
                    <>
                      results are enriched with movie metadata from TMDB before
                      being returned to the frontend,
                    </>,
                    <>
                      recommendation inputs are <strong className="text-white">not used to create a permanent personal identity profile</strong> for you.
                    </>,
                  ]}
                />
                <p>
                  In short: your ratings are processed to answer your request,
                  not to build a user account history.
                </p>
              </SectionCard>

              <SectionCard
                id="third-party"
                title="Third-Party Services"
              >
                <p>
                  WeMovies AI relies on a small set of third-party services to
                  operate. These services process data only to the extent needed
                  to provide the product.
                </p>
                <BulletList
                  items={[
                    <>
                      <strong className="text-white">TMDB</strong> provides
                      movie metadata, search results, posters, overviews, ratings,
                      and genre discovery data.
                    </>,
                    <>
                      <strong className="text-white">Hugging Face</strong>{' '}
                      hosts the recommendation model artifact used by the FastAPI
                      backend. The model file is downloaded dynamically at
                      runtime when needed.
                    </>,
                    <>
                      <strong className="text-white">Resend</strong> is used to
                      deliver contact form messages sent through `/api/contact`.
                    </>,
                    <>
                      <strong className="text-white">Vercel</strong> hosts the
                      Next.js frontend and frontend-side route handlers.
                    </>,
                    <>
                      <strong className="text-white">Backend container hosting</strong>{' '}
                      runs the FastAPI API and temporary model cache in a Docker
                      environment.
                    </>,
                  ]}
                />
                <p>
                  These providers may maintain their own logs and operational
                  safeguards under their respective terms and privacy policies.
                </p>
              </SectionCard>

              <SectionCard id="retention" title="Data Retention">
                <p>
                  WeMovies AI is intentionally designed to minimize long-term data
                  retention.
                </p>
                <BulletList
                  items={[
                    <>
                      <strong className="text-white">Recommendation inputs</strong>{' '}
                      are used transiently to produce recommendation results and
                      are not stored as a persistent user profile.
                    </>,
                    <>
                      <strong className="text-white">Model files cached by the backend</strong>{' '}
                      do not contain your personal data; they are machine
                      learning artifacts used to serve inference.
                    </>,
                    <>
                      <strong className="text-white">Contact form messages</strong>{' '}
                      may be retained for as long as reasonably needed to respond,
                      support operations, maintain records, or comply with legal
                      obligations.
                    </>,
                    <>
                      <strong className="text-white">Operational logs</strong>{' '}
                      may be retained by our hosting providers for security,
                      debugging, and reliability purposes under their normal
                      retention practices.
                    </>,
                  ]}
                />
              </SectionCard>

              <SectionCard id="security" title="Security">
                <p>
                  We use reasonable technical and operational safeguards to
                  protect the services that power WeMovies AI, including hosted
                  infrastructure, environment-variable based secret management,
                  and provider-managed HTTPS delivery.
                </p>
                <p>
                  No internet-based service can promise absolute security, but we
                  aim to keep the data we process limited, practical, and aligned
                  with the lightweight nature of the product.
                </p>
              </SectionCard>

              <SectionCard id="rights" title="Your Rights">
                <BulletList
                  items={[
                    <>
                      You may choose not to submit the contact form if you do not
                      want us to process your message details.
                    </>,
                    <>
                      You may contact us to request deletion of information you
                      submitted through the contact form, subject to any legal or
                      operational obligations that require retention.
                    </>,
                    <>
                      Depending on your jurisdiction, you may also have rights to
                      request access, correction, or deletion of personal
                      information processed about you.
                    </>,
                  ]}
                />
                <p>
                  Because WeMovies AI does not currently provide account-based
                  profiles, most recommendation interactions are session-like and
                  not tied to a long-term user identity.
                </p>
              </SectionCard>

              <SectionCard
                id="contact"
                title="Contact Information"
              >
                <p>
                  If you have questions about this Privacy Policy or how the
                  application handles data in practice, you can contact us at:
                </p>
                <a
                  href="mailto:support@wemovies.ai"
                  className="inline-flex items-center gap-2 text-[#00d2ff] hover:text-white transition-colors font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  support@wemovies.ai
                </a>
              </SectionCard>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
