import { JSX } from 'react';

export type Process = {
  Component: React.ComponentType;
  hasWindow?: boolean;
  title: string;
  icon: string;
};

export type Processes = {
  [pid: string]: Process;
};

export type ProcessesMap = (
  callback: ([id, process]: [string, Process]) => JSX.Element
) => JSX.Element[];

export type ProcessState = {
  processes: Processes;
  close: (pid: string) => void;
  open: (pid: string) => void;
};
