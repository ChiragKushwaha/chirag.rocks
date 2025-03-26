'use client';
import Desktop from '../components/system/desktop';
import ProcessLoader from '../components/system/process-loader';

export default function Home() {
  return (
    <Desktop>
      <ProcessLoader />
    </Desktop>
  );
}
