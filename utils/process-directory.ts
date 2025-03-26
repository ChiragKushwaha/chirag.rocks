import dynamic from 'next/dynamic';
import type { Processes } from '../types/context/process';

const STARTUP_PROCESSES: string[] = ['HelloWorld'];

export const processDirectory: Processes = {
  HelloWorld: {
    Component: dynamic(() => import('../components/hello-world')),
    hasWindow: true
  }
};

export const getStartupProcesses = (): Processes => {
  return STARTUP_PROCESSES.reduce(
    (acc, id) => ({
      ...acc,
      [id]: processDirectory[id]
    }),
    {}
  );
};
