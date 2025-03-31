const Window = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="bg-amber-200 absolute">{children}</div>;
};

export default Window;
