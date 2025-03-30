'use client';
import React, { useCallback, useState } from 'react';
import useLocaleTimeDate from '../../hooks/useLocaleTimeDate';
import useSyncedClock from '../../hooks/useSyncedClock';

const Clock = () => {
  const [now, setNow] = useState(new Date());
  const { time } = useLocaleTimeDate(now);
  const updateClock = useCallback(() => setNow(new Date()), []);

  useSyncedClock(updateClock);

  return <div suppressHydrationWarning>{time}</div>;
};

export default Clock;
