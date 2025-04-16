const WindowWithSidebar = () => {
  return (
    <div
      className="w-[600px] h-[400px] flex"
      style={{
        borderRadius: '10px',
        background: '#ffffff',
        mixBlendMode: 'multiply',
        boxShadow:
          '0px 36px 100px 0px rgba(0, 0, 0, 0.40), 0px 0px 3px 0px rgba(0, 0, 0, 0.55)'
      }}
    >
      <div
        className="w-[200px] h-full"
        style={{
          borderRadius: '10px 0px 0px 10px',
          background:
            'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), rgba(246, 246, 246, 0.84)',
          backgroundBlendMode: 'plus-darker, normal',
          backdropFilter: 'blur(40.774227142333984px)'
        }}
      ></div>
      <div
        className="w-[1px] h-full"
        style={{
          background: 'rgba(0, 0, 0, 0.10)',
          boxShadow: '-1px 0px 0.5px 0px rgba(0, 0, 0, 0.05)'
        }}
      ></div>
      <div
        className="w-full h-full"
        style={{
          border: '20px solid #FF000033',
          borderRadius: '0px 10px 10px 0px',
          background: 'rgba(0, 0, 0, 0.00)',
          boxShadow: '0px 0px 3px 0px rgba(255, 255, 255, 0.10) inset'
        }}
      ></div>
    </div>
  );
};
export default WindowWithSidebar;
