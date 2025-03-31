import dynamic from 'next/dynamic';
import { ProcessComponentProps } from '../components/system/processes/render-process';

export type Process = {
  pid: string;
  Component: React.ComponentType<ProcessComponentProps>;
  hasWindow?: boolean;
  title: string;
  icon: string;
  minimized?: boolean;
  maximized?: boolean;
};

export type Processes = {
  [pid: string]: Process;
};

const STARTUP_PROCESSES: string[] = [];

export const processDirectory: Processes = {
  HelloWorld: {
    Component: dynamic(() => import('../components/app/hello-world')),
    hasWindow: true,
    title: 'Hello World',
    icon: '/favicon.ico',
    minimize: true,
    maximize: true,
    pid: 'HelloWorld'
  }
};

export const getStartupProcesses = (): Processes => {
  return STARTUP_PROCESSES.reduce(
    (processes, pid) => ({
      ...processes,
      [pid]: processDirectory[pid]
    }),
    {}
  );
};
