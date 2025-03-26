import type React from 'react';

const Window = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="bg-amber-200 w-full h-full">{children}</div>;
};

export default Window;
