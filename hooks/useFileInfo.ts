import { useEffect, useState } from 'react';
import useFileSystem from './useFileSystem';
import { extname } from 'path';
import { IMAGE_FILE_EXTENSION } from '../utils/constants';
import {
  getProcessByFileExtension,
  getShortcut
} from '../utils/file-functions';

type FileInfo = {
  icon: string;
  pid: string;
};

const useFileInfo = (path: string): FileInfo => {
  const [_icon, setIcon] = useState<string>();
  const [_pid, setPid] = useState<string>();
  const { fs } = useFileSystem();

  useEffect(() => {
    if (fs) {
      const extension = extname(path);
      if (extension === '.url') {
        getShortcut(path, fs).then(({ URL, IconFile }) => {
          setPid(URL);
          setIcon(IconFile);
        });
      } else if (IMAGE_FILE_EXTENSION.includes(extension)) {
        setIcon(path);
        setPid('ImageViewer');
      } else {
        setPid(getProcessByFileExtension(extension));
      }
    }
  }, [fs, path]);
  return {
    icon: '',
    pid: ''
  };
};
export default useFileInfo;
