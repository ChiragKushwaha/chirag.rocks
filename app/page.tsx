'use client';
import Desktop from '../components/system/desktop';
import ProcessLoader from '../components/system/process-loader';
import Taskbar from '../components/system/taskbar';

export default function Home() {
  return (
    <Desktop>
      <Taskbar />
      <ProcessLoader />
    </Desktop>
  );
}
