'use client';

import nextConfig from '../next.config';

type LocaleTimeDate = {
  time: string;
  date: string;
  dateTime: string;
};

const useLocaleTimeDate = (now: Date): LocaleTimeDate => {
  const locale =
    typeof window !== 'undefined'
      ? navigator.language
      : nextConfig.i18n?.defaultLocale;

  return {
    time: new Intl.DateTimeFormat(locale, formats.time).format(now),
    date: new Intl.DateTimeFormat(locale, formats.date).format(now),
    dateTime: now.toISOString()
  };
};

export default useLocaleTimeDate;

const formats: {
  date: Intl.DateTimeFormatOptions;
  time: Intl.DateTimeFormatOptions;
} = {
  date: {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  },
  time: {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }
};
