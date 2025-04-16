const WindowView = () => {
  return (
    <div
      className="w-[600px] h-[400px]"
      style={{
        borderRadius: '10px',
        background: '#ffffff',
        mixBlendMode: 'multiply',
        boxShadow:
          '0px 36px 100px 0px rgba(0, 0, 0, 0.40), 0px 0px 3px 0px rgba(0, 0, 0, 0.55)'
      }}
    >
      <div
        style={{
          border: '20px solid #FF000033',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.00)',
          boxShadow: '0px 0px 3px 0px rgba(255, 255, 255, 0.10) inset',
          width: '100%',
          height: '100%'
        }}
      ></div>
    </div>
  );
};

export default WindowView;
