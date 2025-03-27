import Image from 'next/image';
import type { DockItem } from './taskbar';

const TaskbarEntry = ({ item }: { item: DockItem }) => {
  return (
    <li
      key={item.title}
      className={`flex items-center justify-center min-w-12 w-12.5 h-12.5
     align-bottom transition-transform duration-200 origin-bottom hover:mx-3.25 group`}
    >
      <div className="absolute top-[-70px] bg-black bg-opacity-50 text-white text-opacity-90 h-2.5 py-2.5 px-3.5 flex items-center justify-center rounded invisible group-hover:visible after:content-[''] after:absolute after:bottom-[-4px] after:w-0 after:h-0 after:backdrop-blur-sm after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-black after:opacity-50">
        {item.title}
      </div>

      <Image
        width={24}
        height={24}
        src={item.icon}
        alt={item.title}
        quality={`100`}
        className="ico w-full h-full object-cover transition-transform duration-200"
      />
    </li>
  );
};

export default TaskbarEntry;
