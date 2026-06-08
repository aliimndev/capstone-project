'use client';

interface SubmitButtonProps {
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
}

export function SubmitButton({ isSubmitting, submitStatus }: SubmitButtonProps) {
  if (submitStatus === 'success') {
    return (
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
        <p className="text-emerald-400 font-medium flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Message sent successfully! We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <p className="text-red-400 font-medium">
            Failed to send message. Please try again.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-[#00d2ff] hover:bg-[#00d2ff]/80 disabled:bg-[#00d2ff]/50 text-[#091020] font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00d2ff]/30 disabled:cursor-not-allowed"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full px-6 py-4 bg-[#00d2ff] hover:bg-[#00d2ff]/80 disabled:bg-[#00d2ff]/50 text-[#091020] font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#00d2ff]/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-[#091020]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Sending...
        </>
      ) : (
        'Send Message'
      )}
    </button>
  );
}