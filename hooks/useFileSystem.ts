import { useEffect, useState } from 'react';

import * as BrowserFs from 'browserfs';
import type { FSModule } from 'browserfs/dist/node/core/FS';
import type { FileSystemConfiguration } from 'browserfs';

type FileSystemType = {
  fs: FSModule | null;
};

const useFileSystem = (): FileSystemType => {
  const [fs, setFs] = useState<FSModule | null>(null);

  useEffect(() => {
    const config: FileSystemConfiguration = {
      fs: 'IndexedDb',
      options: {}
    };
    BrowserFs.install(window);
    BrowserFs.configure(config, () => {
      setFs(BrowserFs.BFSRequire('fs'));
    });
  }, [setFs]);

  return { fs };
};

export default useFileSystem;
