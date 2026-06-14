'use client';

import { useEffect, useRef, useState } from 'react';

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Bulletproof attribute initialization for mobile browsers (especially Safari iOS)
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.defaultMuted = true;
    video.muted = true;

    // Force play on mount/hydration
    const attemptPlay = () => {
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('[BackgroundVideo] Autoplay blocked, waiting for interaction or loading', err);

          // Fallback trigger: attempt to play on first user interaction if blocked
          const playOnInteraction = () => {
            video.play()
              .then(() => {
                setIsPlaying(true);
                removeListeners();
              })
              .catch(() => {});
          };

          const removeListeners = () => {
            window.removeEventListener('click', playOnInteraction);
            window.removeEventListener('touchstart', playOnInteraction);
            window.removeEventListener('keydown', playOnInteraction);
          };

          window.addEventListener('click', playOnInteraction, { passive: true });
          window.addEventListener('touchstart', playOnInteraction, { passive: true });
          window.addEventListener('keydown', playOnInteraction, { passive: true });
        });
    };

    attemptPlay();

    // Re-attempt play on visibility change (e.g., user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isPlaying) {
        attemptPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-screen h-[100dvh] z-[-1] overflow-hidden bg-[#091020] pointer-events-none select-none"
    >
      {/*
        High-performance background video:
        - playsinline: stops iOS from hijacking to native full screen
        - muted/loop/autoplay: standard background video requirements
        - disablePictureInPicture/disableRemotePlayback: avoids accidental menu popups
        - pointer-events-none: disables any mouse/touch interaction
      */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        autoPlay
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-60 pointer-events-none select-none"
        style={{
          // Hardware acceleration & layout stabilization hint
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
      />

      {/*
        Layer 2: Gradient overlays.
        We merge the gradients to ensure solid performance and avoid subpixel/scaling artifacts.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#091020]/75 to-[#091020] mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-[#091020]/50 pointer-events-none" />
    </div>
  );
}
