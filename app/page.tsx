'use client';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import HelloWorld from '../components/hello-world';
import processDirectory from '../utils/process-directory';
import ProcessLoader from '../utils/process-loader';

interface BearState {
  bears: number;
  increase: (by: number) => void;
}
const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by }))
      }),
      { name: 'bearStore' }
    )
  )
);

export default function Home() {
  const { bears, increase } = useBearStore();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <ProcessLoader />
      <h1 className="text-8xl">{bears}</h1>
      <div className="flex space-x-1">
        <button className="" onClick={() => increase(-1)}>
          -
        </button>
        <button className="" onClick={() => increase(1)}>
          +
        </button>
      </div>
    </div>
  );
}
