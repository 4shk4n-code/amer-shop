// Suppress harmless warnings from third-party libraries and Vercel widgets
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Suppress Zustand deprecation warnings
    if (message.includes('[DEPRECATED]') && message.includes('zustand')) {
      return;
    }
    // Suppress Dialog accessibility warnings from Vercel widgets
    if (message.includes('DialogContent') || message.includes('DialogTitle')) {
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
}

