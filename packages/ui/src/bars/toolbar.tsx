import {
  ChevronBackward,
  ChevronDown,
  ChevronForward,
  MagnifyingglassRegular,
  SquareDashed
} from '../../../icons/src';
import WindowControls from '../views/window/window-controls';

enum ToolbarType {
  STANDARD = 'standard',
  MONO = 'mono'
}
type TToolbarType = {
  type: ToolbarType;
  className?: string;
  title: string;
  subtitle?: string;
};
const Toolbar = ({ type = ToolbarType.STANDARD, ...props }: TToolbarType) => {
  switch (type) {
    case ToolbarType.STANDARD:
      return <ToolbarVariation className="h-[52px]" {...props} />;
    case ToolbarType.MONO:
      return <ToolbarVariation className="h-[38px]" {...props} />;
  }
};

const ToolbarVariation = (props: Omit<TToolbarType, 'type'>) => {
  const { className = '' } = props;
  return (
    <div
      className={`bg-[#ffffff01] flex items-center justify-between w-[720px] px-[12px] ${className}`}
    >
      <Leading {...props} />
      <Trailing />
    </div>
  );
};
const Leading = (props: Omit<TToolbarType, 'type'>) => {
  return (
    <div className="flex items-center">
      <WindowControls />
      <Spacer width={14} />
      <BackwardForward />
      <Spacer width={14} />
      <TitleSubtitle {...props} />
    </div>
  );
};

const BackwardForward = () => {
  return (
    <div className="flex items-center space-x-[8px] text-black">
      <div className="p-[7px]">
        <ChevronBackward width={13} height={16} />
      </div>
      <div className="p-[7px]">
        <ChevronForward width={13} height={16} />
      </div>
    </div>
  );
};

const TitleSubtitle = (props: Omit<TToolbarType, 'type' | 'className'>) => {
  const { title = 'Title', subtitle } = props;
  return (
    <div className="flex flex-col">
      <div className="text-black text-[14px] font-semibold">{title}</div>
      {subtitle && (
        <div className="text-[#00000085] text-[12px] font-normal">
          {subtitle}
        </div>
      )}
    </div>
  );
};

const Trailing = () => {
  return (
    <div className="flex items-center">
      <SegmentedControl />
      <Spacer width={24} />
      <PullDownButton />
      <Spacer />
      <PullDownButton />
      <Spacer width={24} />
      <SearchBar />
    </div>
  );
};

const SegmentedControl = () => {
  return (
    <div className="flex items-center space-x-[8px] divider-x-[#0000001a] text-black">
      <SquareDashed width={20} height={16} />
      <Divider />
      <SquareDashed width={20} height={16} />
    </div>
  );
};

const Divider = () => {
  return <div className="w-[1px] h-[24px] bg-[#0000001a]" />;
};

const Spacer = ({ width = 8 }: { width?: number }) => {
  return <div style={{ width: `${width}px` }} />;
};

const PullDownButton = () => {
  return (
    <div className="flex items-center space-x-[6px]">
      <SquareDashed width={20} height={16} />
      <ChevronDown width={10} height={10} />
    </div>
  );
};

const SearchBar = () => {
  return (
    <div className="flex items-center space-x-[6px] border border-[#0000001a] rounded-[4px] px-[6px] py-[2px] focus-within:border-[#00000020] w-[130px]">
      <MagnifyingglassRegular
        color="black"
        style={{ minWidth: '20px' }}
        width={20}
        height={16}
      />
      <input type="text" placeholder="Search" className="outline-none group" />
    </div>
  );
};

export default Toolbar;
