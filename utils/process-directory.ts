import dynamic from 'next/dynamic';
import type { Processes } from '../types/process-directory';

const processDirectory: Processes = {
  HelloWorld: {
    Component: dynamic(() => import('../components/hello-world'))
  }
};

export default processDirectory;
