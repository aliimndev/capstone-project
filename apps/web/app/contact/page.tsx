'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SubmitButton } from '@/components/contact/SubmitButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// ─── Reusable field component ─────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
  disabled?: boolean;
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  error,
  placeholder,
  disabled,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-[11px] font-semibold uppercase tracking-widest text-white/40"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={[
          'w-full px-4 py-3.5 rounded-xl text-sm text-white',
          'bg-white/[0.06] border',
          'placeholder:text-white/20',
          'focus:outline-none focus:ring-2 transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error
            ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10'
            : 'border-white/[0.08] hover:border-white/20 focus:border-[#00d2ff]/50 focus:ring-[#00d2ff]/10',
        ].join(' ')}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            key={`err-${name}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Success panel ────────────────────────────────────────────────────────────

function SuccessPanel({
  senderEmail,
  onReset,
}: {
  senderEmail: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-[#091020]/60 backdrop-blur-2xl border border-[#00d2ff]/15 rounded-2xl px-8 py-14 md:px-14 shadow-[0_0_80px_rgba(0,210,255,0.08),0_32px_64px_rgba(0,0,0,0.5)] text-center overflow-hidden"
    >
      {/* Top accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#00d2ff]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-[#00d2ff]/5 blur-2xl rounded-full" />

      {/* Animated check */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.15,
          duration: 0.55,
          type: 'spring',
          stiffness: 200,
          damping: 18,
        }}
        className="flex items-center justify-center w-20 h-20 mx-auto mb-7 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/25"
      >
        <CheckCircle className="w-9 h-9 text-[#00d2ff]" strokeWidth={1.75} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight"
      >
        Message Sent!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-white/45 text-sm leading-relaxed mb-1"
      >
        Thanks for reaching out. We&apos;ll get back to you
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="text-[#00d2ff]/70 text-sm font-medium mb-10"
      >
        {senderEmail}
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        onClick={onReset}
        className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200 tracking-wide"
      >
        ← Send another message
      </motion.button>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastEmail, setLastEmail] = useState('');

  // ── Validation (unchanged logic) ────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ── Submit handler (unchanged payload shape) ─────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setLastEmail(formData.email);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitStatus('idle');
    setErrors({});
  };

  // ── Stagger config ───────────────────────────────────────────────────────────
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative z-10">
      <SiteHeader />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* ── Decorative ambient glows ─────────────────────────────────── */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-32 w-[700px] h-[300px] bg-[#00d2ff]/[0.04] rounded-full blur-[100px] -z-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/4 top-56 w-[260px] h-[260px] bg-[#0b2551]/80 rounded-full blur-[80px] -z-10"
          />

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 mb-7"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span className="text-xs font-medium text-white/65 tracking-wide">
                We read every message
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight"
            >
              Get in{' '}
              <span
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #a4f4fd 0%, #00d2ff 40%, #a4f4fd 80%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                }}
                className="animate-shiny"
              >
                Touch
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease }}
              className="text-white/45 text-base md:text-lg max-w-sm mx-auto leading-relaxed"
            >
              Questions, feedback, or just want to say hello — we&apos;re listening.
            </motion.p>
          </div>

          {/* ── Form card / Success panel ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {submitStatus === 'success' ? (
              <SuccessPanel
                key="success"
                senderEmail={lastEmail}
                onReset={handleReset}
              />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, delay: 0.25, ease }}
                className="relative"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent rounded-full" />

                <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] rounded-2xl p-7 md:p-10 shadow-[0_0_80px_rgba(0,210,255,0.05),0_32px_64px_rgba(0,0,0,0.55)]">

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        label="Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Your name"
                        disabled={isSubmitting}
                      />
                      <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="you@example.com"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Subject */}
                    <FormField
                      label="Subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      placeholder="What's on your mind?"
                      disabled={isSubmitting}
                    />

                    {/* Message */}
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="block text-[11px] font-semibold uppercase tracking-widest text-white/40"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Tell us more..."
                        className={[
                          'w-full px-4 py-3.5 rounded-xl text-sm text-white',
                          'bg-white/[0.06] border',
                          'placeholder:text-white/20',
                          'focus:outline-none focus:ring-2 transition-all duration-200',
                          'resize-none disabled:opacity-40 disabled:cursor-not-allowed',
                          errors.message
                            ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10'
                            : 'border-white/[0.08] hover:border-white/20 focus:border-[#00d2ff]/50 focus:ring-[#00d2ff]/10',
                        ].join(' ')}
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            key="err-message"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1.5 text-xs text-red-400"
                          >
                            <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                            {errors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit */}
                    <SubmitButton
                      isSubmitting={isSubmitting}
                      submitStatus={submitStatus}
                    />
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Contact info card ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease }}
            className="mt-8 flex justify-center"
          >
            <a
              href="mailto:support@wemovies.ai"
              className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-[#00d2ff]/20 rounded-2xl px-6 py-4 transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,210,255,0.07)]"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/20 flex-shrink-0 transition-colors duration-300 group-hover:bg-[#00d2ff]/15">
                <Mail className="w-4 h-4 text-[#00d2ff]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">
                  Or reach us directly
                </p>
                <p className="text-sm font-medium text-white/60 group-hover:text-[#00d2ff]/80 transition-colors duration-300">
                  support@wemovies.ai
                </p>
              </div>
            </a>
          </motion.div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
