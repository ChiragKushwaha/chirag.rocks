'use client';

import { basename, extname, resolve } from 'path';
import FileEntry from './file-entry';
import useFiles from '../../../hooks/useFiles';

type FileManagerProps = {
  directory: string;
};

const FileManager = ({ directory }: FileManagerProps) => {
  return (
    <>
      <ol className="w-full h-full file-manager">
        {useFiles(directory, (file) => (
          <FileEntry
            key={file}
            name={basename(file, extname(file))}
            path={resolve(directory, file)}
          />
        ))}
      </ol>
      <style jsx>{`
        .file-manager {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: repeat(auto-fill, 74px);
          grid-template-rows: repeat(auto-fill, 70px);
          padding: 5px, 0;
          row-gap: 28px;
          column-gap: 1px;
        }
      `}</style>
    </>
  );
};

export default FileManager;
