import { SquareDashed } from '../../../icons/src';
import TitleBar from './title-bar';

const TabBar = () => {
  return (
    <div className="flex flex-col w-[720px]">
      <TitleBar />
      <TabBarItems />
    </div>
  );
};

const TabBarItems = () => {
  return (
    <div className="space-x-[2px] flex items-center justify-center w-full h-[45px]">
      <TabBarItem selected />
      <TabBarItem />
      <TabBarItem />
    </div>
  );
};

const TabBarItem = ({ selected = false }: { selected?: boolean }) => {
  return (
    <div
      style={{
        backgroundColor: selected ? '#00000005' : '#ffff',
        boxShadow: selected ? '#000000 0 0.75 3 0' : 'none',
        border: selected ? '#979797' : 'transparent',
        color: selected ? '#007AFF' : '#000000',
        opacity: selected ? 1 : 0.5
      }}
      className={`flex flex-col items-center pt-[] justify-center w-[75px] h-[45px] space-y-[3px] rounded-[6px]`}
    >
      <SquareDashed height={18} />
      <div className="h-[14px] text-center text-[12px]">Tab Item</div>
    </div>
  );
};

export default TabBar;
