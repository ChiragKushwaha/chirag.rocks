import Close from './x/close';
import Minimize from './x/minimize';
import Zoom from './x/zoom';

const WindowControls = () => {
  return (
    <div className="max-w-min gap-x-[8px] flex justify-center">
      <Close />
      <Minimize />
      <Zoom />
    </div>
  );
};

export default WindowControls;
