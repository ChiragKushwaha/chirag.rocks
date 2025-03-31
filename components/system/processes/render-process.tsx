import dynamic from 'next/dynamic';
import type { Process } from '../../../utils/process-directory';

const Window = dynamic(() => import('../../system/window'));

const RenderProcess: React.FC<Process> = ({ Component, hasWindow }) => {
  return hasWindow ? (
    <Window>
      <Component />
    </Window>
  ) : (
    <Component />
  );
};

export default RenderProcess;
