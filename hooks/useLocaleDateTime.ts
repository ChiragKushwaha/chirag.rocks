import nextConfig from '../next.config';
import { timeFormats } from '../utils/time-formats';

type LocaleTimeDate = {
  time: string;
  date: string;
  dateTime: string;
};

const useLocaleDateTime = (now: Date): LocaleTimeDate => {
  const locale =
    typeof window !== 'undefined'
      ? navigator.language
      : nextConfig.i18n?.defaultLocale;

  const date = new Intl.DateTimeFormat(locale, timeFormats.date).format(now);
  const time = new Intl.DateTimeFormat(locale, timeFormats.time).format(now);
  const dateTime = now.toISOString();

  return { time, date, dateTime };
};

export default useLocaleDateTime;
