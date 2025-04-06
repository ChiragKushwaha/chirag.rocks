import Notification from './notification';
import OpenIndicator from './open-indicator';

const DocIcon = () => {
  return (
    <div className="w-[50px] h-[60px] flex flex-col items-center justify-between space-y-[3px]">
      <div className="relative">
        <Notification className="absolute right-0 top-[1.5px]" />
        <img
          width={50}
          height={50}
          src={'/assets/system-icons/Messages.png'}
          alt="Messages"
        />
      </div>
      <OpenIndicator variant="light" />
    </div>
  );
};

export default DocIcon;
