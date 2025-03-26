import dynamic from 'next/dynamic';
import { Processes } from '../types/context/process';

const processDirectory: Processes = {
  HelloWorld: {
    Component: dynamic(() => import('../components/hello-world')),
    hasWindow: true
  }
};

export default processDirectory;
