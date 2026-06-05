// app/privacy-policy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

const sections = [
  { id: 'information', label: 'Information We Collect' },
  { id: 'usage', label: 'How We Use Your Information' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'security', label: 'Security' },
  { id: 'contact', label: 'Contact Us' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('information');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative z-10">
      <SiteHeader />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">Last updated: May 2026</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Table of Contents - Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <div className="bg-[#091020]/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-[0_0_40px_rgba(0,210,255,0.05)]">
                <h2 className="text-white font-semibold mb-6 text-lg">
                  Table of Content
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'text-[#00d2ff] bg-[#00d2ff]/10 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* Information We Collect */}
              <section id="information" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Information We Collect
                </h2>
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-white font-semibold mb-2">• User Input</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Movies you select and interactions (such as clicks or ratings) used to generate recommendations.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">• Basic Usage Data</h3>
                    <p className="text-gray-400 leading-relaxed">
                      General information like device type and app interactions to help improve performance.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section id="usage" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  We use collected data to:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Generate personalized movie recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Improve recommendation accuracy over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Analyze basic usage to enhance user experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Respond to feedback or inquiries</span>
                  </li>
                </ul>
              </section>

              {/* Third-Party Services */}
              <section id="third-party" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Third-Party Services
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  WeMovies AI may use limited third-party resources, such as:
                </p>
                <ul className="space-y-2 text-gray-400 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Movie datasets (e.g., public datasets like TMDB/Kaggle) for film information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Hosting or deployment platforms</span>
                  </li>
                </ul>
                <p className="text-gray-400 leading-relaxed">
                  These services do not have access to personally identifiable user data.
                </p>
              </section>

              {/* Data Retention */}
              <section id="retention" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Data Retention
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  We only store data temporarily as needed to provide recommendations. 
                  No long-term personal data storage is intended.
                </p>
              </section>

              {/* Your Rights */}
              <section id="rights" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Your Rights
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">You may:</p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Request deletion of any provided data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-1.5">•</span>
                    <span>Contact us regarding privacy concerns</span>
                  </li>
                </ul>
              </section>

              {/* Security */}
              <section id="security" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Security
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  We apply reasonable measures to protect user data. However, no system 
                  is completely secure, and improvements are continuously made.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact:
                </p>
                <a
                  href="mailto:support@wemovies.ai"
                  className="inline-flex items-center gap-2 text-[#00d2ff] hover:text-white transition-colors"
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
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}