import dynamic from 'next/dynamic';
import Clock from '../components/system/clock';
import type { Processes } from '../types/context/process';

const STARTUP_PROCESSES: string[] = ['Clock', 'HelloWorld'];

export const processDirectory: Processes = {
  Clock: {
    Component: Clock,
    hasWindow: true
  },
  HelloWorld: {
    Component: dynamic(() => import('../components/app/hello-world')),
    hasWindow: true
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
