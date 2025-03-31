import type { FSModule } from 'browserfs/dist/node/core/FS';
import ini from 'ini';

export const getProcessByFileExtension = (_extension: string): string => '';

type Shortcut = {
  URL: string;
  IconFile: string;
};

export const getShortcut = (path: string, fs: FSModule) =>
  new Promise<Shortcut>((resolve) => {
    fs.readFile(path, (_error, contents = Buffer.from('')) => {
      resolve(ini.parse(contents.toString()) as Shortcut);
    });
  });
