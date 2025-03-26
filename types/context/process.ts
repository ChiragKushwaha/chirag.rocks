export type Process = {
  Component: React.ComponentType;
  hasWindow: boolean;
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessState = {
  processes: Processes;
};
