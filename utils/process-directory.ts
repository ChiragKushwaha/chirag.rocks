import dynamic from 'next/dynamic';

const processDirectory = {
  HelloWorld: {
    Component: dynamic(() => import('../components/hello-world'))
  }
};

export default processDirectory;
