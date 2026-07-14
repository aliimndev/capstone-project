'use client';

interface SubmitButtonProps {
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
}

export function SubmitButton({ isSubmitting, submitStatus }: SubmitButtonProps) {
  const isError = submitStatus === 'error';

  return (
    <div className="space-y-3 pt-1">
      {isError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/[0.07] border border-red-500/20">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500-400 flex-shrink-0" />
          <p className="text-xs text-blue-500-400">
            Couldn&apos;t deliver your message — please try again.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={[
          'w-full px-6 py-4 rounded-xl font-semibold text-sm',
          'flex items-center justify-center gap-2.5',
          'transition-all duration-200',
          'bg-[#00d2ff] text-[#091020]',
          'hover:bg-[#00d2ff]/90',
          'hover:shadow-[0_0_32px_rgba(0,210,255,0.45)]',
          'hover:scale-[1.015]',
          'active:scale-[0.985]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'disabled:scale-100 disabled:shadow-none',
        ].join(' ')}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-[#091020] flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <span>Sending…</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 flex-shrink-0 -rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
            <span>{isError ? 'Try Again' : 'Send Message'}</span>
          </>
        )}
      </button>
    </div>
  );
}
