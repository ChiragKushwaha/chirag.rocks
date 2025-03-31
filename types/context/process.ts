export type Process = {
  Component: React.ComponentType;
  hasWindow?: boolean;
  title: string;
  icon: string;
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessState = {
  processes: Processes;
  close: (processId: string) => void;
  open: (processId: string) => void;
};
