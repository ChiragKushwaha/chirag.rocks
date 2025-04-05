export const MILLISECONDS_IN_SECONDS = 1000;

export const HEIF_IMAGE_FORMATS = new Set([
  '.heic',
  '.heics',
  '.heif',
  '.heifs',
  '.avci',
  '.avcs'
]);

export const TIFF_IMAGE_FORMATS = new Set([
  '.cr2',
  '.dng',
  '.nef',
  '.tif',
  '.tiff'
]);

export const CLIPBOARD_FILE_EXTENSIONS = new Set(['.jpeg', '.jpg', '.png']);

export const NATIVE_IMAGE_FORMATS = new Set([
  '.apng',
  '.avif',
  '.bmp',
  '.gif',
  '.ico',
  '.jfif',
  '.jif',
  '.jpe',
  '.jpeg',
  '.jpg',
  '.pjp',
  '.pjpeg',
  '.png',
  '.svg',
  '.webp',
  '.xbm'
]);

export const IMAGE_FILE_EXTENSIONS = new Set([
  ...NATIVE_IMAGE_FORMATS,
  ...HEIF_IMAGE_FORMATS,
  ...TIFF_IMAGE_FORMATS,
  '.ani',
  '.cur',
  '.jxl',
  '.qoi'
]);

export const UNSUPPORTED_SLIDESHOW_EXTENSIONS = new Set([
  ...HEIF_IMAGE_FORMATS,
  ...TIFF_IMAGE_FORMATS,
  '.jxl',
  '.qoi',
  '.svg'
]);

export const TEXT_EDITORS = ['MonacoEditor', 'Vim'];

export const CURSOR_FILE_EXTENSIONS = new Set(['.ani', '.cur']);

export const SUMMARIZABLE_FILE_EXTENSIONS = new Set([
  '.html',
  '.htm',
  '.whtml',
  '.md',
  '.txt',
  '.pdf'
]);

export const EDITABLE_IMAGE_FILE_EXTENSIONS = new Set([
  '.bmp',
  '.gif',
  '.ico',
  '.jfif',
  '.jpe',
  '.jpeg',
  '.jpg',
  '.png',
  '.tif',
  '.tiff',
  '.webp'
]);

export const MENU_SEPERATOR = { seperator: true };

export const MILLISECONDS_IN_SECOND = 1000;

export const MILLISECONDS_IN_MINUTE = 60000;

export const MILLISECONDS_IN_DAY = 86400000;

export const ZIP_EXTENSIONS = new Set(['.jsdos', '.pk3', '.wsz', '.zip']);

export const MOUNTABLE_EXTENSIONS = new Set(['.iso', ...ZIP_EXTENSIONS]);

export const SPREADSHEET_FORMATS = [
  '.csv',
  '.numbers',
  '.ods',
  '.xls',
  '.xlsx'
];
