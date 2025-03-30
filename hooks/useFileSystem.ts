import { useEffect, useState } from 'react';

import { configure, BFSRequire } from 'browserfs';
import type { FSModule } from 'browserfs/dist/node/core/FS';
import fileSystemConfig from '../utils/filesystem-config';

type FileSystemType = {
  fs: FSModule | null;
};

const useFileSystem = (): FileSystemType => {
  const [fs, setFs] = useState<FSModule | null>(null);

  useEffect(() => {
    if (!fs) {
      configure(fileSystemConfig, () => {
        setFs(BFSRequire('fs'));
      });
    }
    return () => {};
  }, [fs]);

  return { fs };
};

export default useFileSystem;
