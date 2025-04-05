'use client';
import useClock from '../../hooks/useClock';
import useLocaleTimeDate from '../../hooks/useLocaleDateTime';

const Clock = () => {
  const now = useClock();
  const { time } = useLocaleTimeDate(now);

  return <div suppressHydrationWarning>{time}</div>;
};

export default Clock;
