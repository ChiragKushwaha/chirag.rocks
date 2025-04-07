import { SquareDashed } from '../../../icons/src';
import TitleBar from './title-bar';

const TabBar = () => {
  return (
    <div className="flex flex-col">
      <TitleBar />
      <TabBarItems />
    </div>
  );
};

const TabBarItems = () => {
  return (
    <div className="space-x-[2px] flex items-center justify-center w-full h-[45px] bg-amber-300">
      <TabBarItem selected />
      <TabBarItem />
      <TabBarItem />
    </div>
  );
};

const TabBarItem = ({ selected = false }: { selected?: boolean }) => {
  const selectedClassName = selected ? 'bg-[#115511971]' : 'bg-[#ffffff01]';
  const textColor = selected ? 'text-[#007AFF]' : 'text-[#000000]';
  return (
    <div
      className={`flex flex-col items-center justify-center w-[75px] h-[45px] space-y-[3px] rounded-[2px] ${textColor} ${selectedClassName}}`}
    >
      <SquareDashed height={18} />
      <span className="text-[14px]">Tab Item</span>
    </div>
  );
};

export default TabBar;
