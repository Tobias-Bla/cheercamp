'use client';

import { useEffect } from 'react';

export function ScrollToTopOnMount({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }, [enabled]);

  return null;
}
