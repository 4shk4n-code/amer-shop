"use client";

import { useEffect } from 'react';

// Suppress harmless warnings from third-party libraries and Vercel widgets
export default function SuppressWarnings() {
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      // Suppress Zustand deprecation warnings
      if (message.includes('[DEPRECATED]') && message.includes('zustand')) {
        return;
      }
      // Suppress Dialog accessibility warnings from Vercel widgets
      if (message.includes('DialogContent') || message.includes('DialogTitle') || message.includes('Description')) {
        return;
      }
      // Suppress Next.js Image aspect ratio warnings (we handle with style prop)
      if (message.includes('Image with src') && message.includes('has either width or height modified')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      // Suppress Vercel feedback widget session errors
      if (message.includes('Could not fetch session') && message.includes('feedback.html')) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return null;
}

