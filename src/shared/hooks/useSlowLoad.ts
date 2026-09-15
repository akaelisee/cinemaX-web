import { useEffect, useState } from 'react';

export function useSlowLoad(isPending: boolean, delayMs = 2500): boolean {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setSlow(false);
      return;
    }
    const id = window.setTimeout(() => {
      setSlow(true);
    }, delayMs);
    return () => {
      window.clearTimeout(id);
    };
  }, [isPending, delayMs]);

  return isPending && slow;
}
