import WindowControls from '../views/window/window-controls';

const TitleBar = () => {
  return (
    <div className="flex items-center w-[720px] h-[28px] p-[8px] bg-[#ffffff01] relative">
      <WindowControls />
      <div className="w-full text-black absolute text-center">Title</div>
    </div>
  );
};

export default TitleBar;
