import { extname } from 'path';
import { useEffect, useState } from 'react';
import { IMAGE_FILE_EXTENSIONS } from '../utils/constants';
import {
  getProcessByFileExtension,
  getShortcut
} from '../utils/file-functions';
import useFileSystem from './useFileSystem';

type FileInfo = {
  icon: string;
  pid: string;
};

const useFileInfo = (path: string): FileInfo => {
  const [icon, setIcon] = useState<string>('');
  const [pid, setPid] = useState<string>('');
  const { fs } = useFileSystem();

  useEffect(() => {
    if (fs) {
      const extension = extname(path);
      if (extension === '.url') {
        getShortcut(path, fs).then(({ URL, IconFile }) => {
          setPid(URL);
          setIcon(IconFile);
        });
      } else if (IMAGE_FILE_EXTENSIONS.has(extension)) {
        setIcon(path);
        setPid('ImageViewer');
      } else {
        setPid(getProcessByFileExtension(extension));
      }
    }
  }, [fs, path]);
  return { icon, pid };
};
export default useFileInfo;
