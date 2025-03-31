import dynamic from 'next/dynamic';

export type Process = {
  Component: React.ComponentType;
  hasWindow?: boolean;
  title: string;
  icon: string;
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
    icon: '/favicon.ico'
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
