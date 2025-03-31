export const timeFormats: {
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
