'use client';
import { useEffect } from 'react';
import TaskbarEntry from './taskbar-entry';

export type DockItem = {
  title: string;
  icon: string;
  onClick: React.MouseEventHandler<HTMLLIElement> | undefined;
  className?: string;
};
const list: DockItem[] = [
  {
    title: 'Finder',
    icon: '/icons/finder.png',
    onClick: () => console.log('Finder clicked')
  },
  {
    title: 'Siri',
    icon: '/icons/siri.png',
    onClick: () => console.log('Siri clicked')
  },
  {
    title: 'LaunchPad',
    icon: '/icons/launchpad.png',
    onClick: () => console.log('LaunchPad clicked')
  },
  {
    title: 'Contacts',
    icon: '/icons/contacts.png',
    onClick: () => console.log('Contacts clicked')
  },
  {
    title: 'Notes',
    icon: '/icons/notes.png',
    onClick: () => console.log('Notes clicked')
  },
  {
    title: 'Reminders',
    icon: '/icons/reminders.png',
    onClick: () => console.log('Reminders clicked')
  },
  {
    title: 'Photos',
    icon: '/icons/photos.png',
    onClick: () => console.log('Photos clicked')
  },
  {
    title: 'Messages',
    icon: '/icons/messages.png',
    onClick: () => console.log('Messages clicked')
  },
  {
    title: 'FaceTime',
    icon: '/icons/facetime.png',
    onClick: () => console.log('FaceTime clicked')
  },
  {
    title: 'Music',
    icon: '/icons/music.png',
    onClick: () => console.log('Music clicked')
  },
  {
    title: 'Podcasts',
    icon: '/icons/podcasts.png',
    onClick: () => console.log('Podcasts clicked')
  },
  {
    title: 'TV',
    icon: '/icons/tv.png',
    onClick: () => console.log('TV clicked')
  },
  {
    title: 'App Store',
    icon: '/icons/appstore.png',
    onClick: () => console.log('App Store clicked')
  },
  {
    title: 'Safari',
    icon: '/icons/safari.png',
    onClick: () => console.log('Safari clicked')
  },
  {
    title: 'Bin',
    icon: '/icons/trash.png',
    onClick: () => console.log('Bin clicked')
  }
];
const Taskbar = () => {
  useEffect(() => {
    const icons = document.querySelectorAll('.ico');
    const length = icons.length;

    icons.forEach((item, index) => {
      item.addEventListener('mouseover', (e) => {
        focus(e.target as HTMLElement, index);
      });
      item.addEventListener('mouseleave', () => {
        icons.forEach((item) => {
          (item as HTMLElement).style.transform = 'scale(1)  translateY(0px)';
        });
      });
    });

    const focus = (elem: HTMLElement, index: number) => {
      const previous = index - 1;
      const previous1 = index - 2;
      const next = index + 1;
      const next2 = index + 2;

      if (previous == -1) {
        console.log('first element');
        elem.style.transform = 'scale(1.5)  translateY(-10px)';
      } else if (next == length) {
        elem.style.transform = 'scale(1.5)  translateY(-10px)';
        console.log('last element');
      } else {
        try {
          elem.style.transform = 'scale(1.5)  translateY(-10px)';
          (icons[previous] as HTMLElement).style.transform =
            'scale(1.2) translateY(-6px)';
          (icons[previous1] as HTMLElement).style.transform = 'scale(1.1)';
          (icons[next] as HTMLElement).style.transform =
            'scale(1.2) translateY(-6px)';
          (icons[next2] as HTMLElement).style.transform = 'scale(1.1)';
        } catch (e) {
          console.log(e);
        }
      }
    };
  }, []);
  return (
    <nav className="flex justify-center absolute bottom-5 left-1/2 -translate-x-1/2 p-1 w-auto h-15 items-center rounded-xl bg-gray-500 backdrop-blur-sm border-[0.1px] border-gray-400">
      {list.map((item) => {
        return <TaskbarEntry key={item.title} item={item} />;
      })}
    </nav>
  );
};

export default Taskbar;
