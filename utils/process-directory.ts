import dynamic from 'next/dynamic';
import Taskbar from '../components/system/taskbar';
import type { Processes } from '../types/context/process';
import Clock from '../components/system/clock';

const STARTUP_PROCESSES: string[] = ['Clock', 'HelloWorld', 'Taskbar'];

export const processDirectory: Processes = {
  Clock: {
    Component: Clock,
    hasWindow: true
  },
  HelloWorld: {
    Component: dynamic(() => import('../components/app/hello-world')),
    hasWindow: true
  },
  Taskbar: {
    Component: Taskbar
  }
};

export const getStartupProcesses = (): Processes => {
  return STARTUP_PROCESSES.reduce(
    (processes, processId) => ({
      ...processes,
      [processId]: processDirectory[processId]
    }),
    {}
  );
};
