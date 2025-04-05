import Desktop from '../components/system/desktop';
import FileManager from '../components/system/files/file-manager';
import ProcessLoader from '../components/system/processes/process-loader';
import Taskbar from '../components/system/taskbar';

export default function Home() {
  return (
    <Desktop>
      <Taskbar />
      <FileManager directory="/desktop" />
      <ProcessLoader />
    </Desktop>
  );
}
