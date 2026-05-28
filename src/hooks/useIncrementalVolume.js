import { useState, useEffect } from 'react';

export function useIncrementalVolume(target, duration = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}