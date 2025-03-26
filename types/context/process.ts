import { ComponentType } from 'react';

export type Process = {
  Component: ComponentType;
  hasWindow: boolean;
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessState = {
  processes: Processes;
};
