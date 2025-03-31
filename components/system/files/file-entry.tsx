/* eslint-disable @next/next/no-img-element */
import { useCallback } from 'react';
import useProcessesState from '../../../contexts/process';
import useDoubleClick from '../../../hooks/useDoubleClick';
import useFileInfo from '../../../hooks/useFileInfo';

type FileEntryProps = {
  path: string;
  name: string;
};

const FileEntry = ({ path, name }: FileEntryProps) => {
  const { icon, pid } = useFileInfo(path);
  const open = useProcessesState((state) => state.open);

  const onClick = useCallback(() => open(pid), [open, pid]);

  return (
    <li>
      <button onClick={useDoubleClick(onClick)}>
        <figure>
          {icon && <img src={icon} alt={name} />}
          <figcaption>{name}</figcaption>
        </figure>
      </button>
    </li>
  );
};

export default FileEntry;
