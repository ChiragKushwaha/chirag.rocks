import dynamic from 'next/dynamic';
import type { Process } from '../../../utils/process-directory';

const Window = dynamic(() => import('../window'));

export type ProcessComponentProps = {
  pid: string;
};

const RenderProcess: React.FC<Process> = ({
  Component,
  hasWindow = false,
  pid
}) => {
  return hasWindow ? (
    <Window pid={pid}>
      <Component pid={pid} />
    </Window>
  ) : (
    <Component pid={pid} />
  );
};

export default RenderProcess;
