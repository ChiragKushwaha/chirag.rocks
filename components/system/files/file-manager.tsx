'use client';

import { basename, extname, resolve } from 'path';
import FileEntry from './file-entry';
import useFiles from '../../../hooks/useFiles';

type FileManagerProps = {
  directory: string;
};

const FileManager = ({ directory }: FileManagerProps) => {
  return (
    <ol className="max-w-min">
      {useFiles(directory, (file) => (
        <FileEntry
          key={file}
          name={basename(file, extname(file))}
          path={resolve(directory, file)}
        />
      ))}
    </ol>
  );
};

export default FileManager;
