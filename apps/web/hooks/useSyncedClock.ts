import { useEffect } from 'react';
import { MILLISECONDS_IN_SECONDS } from '../utils/constants';

const useSyncedClock = (callback: () => void) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    timeoutId = setTimeout(() => {
      timeoutId = setInterval(callback, MILLISECONDS_IN_SECONDS);
    }, MILLISECONDS_IN_SECONDS - new Date().getMilliseconds());

    return () => clearTimeout(timeoutId);
  }, [callback]);
};

export default useSyncedClock;
