import WindowControls from './window-controls';

const WindowDrillInNavigation = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        borderRadius: '10px',
        background: '#ffffff',
        mixBlendMode: 'multiply',
        boxShadow:
          '0px 36px 100px 0px rgba(0, 0, 0, 0.40), 0px 0px 3px 0px rgba(0, 0, 0, 0.55)'
      }}
    >
      <div
        style={{
          width: '200px',
          height: '100%',
          borderRadius: '10px 0px 0px 10px',
          background:
            'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), rgba(246, 246, 246, 0.84)',
          backgroundBlendMode: 'plus-darker, normal',
          backdropFilter: 'blur(40.774227142333984px)'
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ height: '52px', width: '52px', margin: '19px' }}
        >
          <WindowControls />
        </div>
      </div>
      <div
        style={{
          width: '1px',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.10)',
          boxShadow: '-1px 0px 0.5px 0px rgba(0, 0, 0, 0.05)'
        }}
      ></div>
      <div
        className="flex flex-col"
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <div
          className=""
          style={{
            height: '52px',
            width: '100%'
          }}
        ></div>
        <div
          className="w-full h-full"
          style={{
            border: '20px solid #FF000033',
            borderRadius: '0px 0px 10px 0px',
            background: 'rgba(0, 0, 0, 0.00)',
            boxShadow: '0px 0px 3px 0px rgba(255, 255, 255, 0.10) inset'
          }}
        ></div>
      </div>
    </div>
  );
};

export default WindowDrillInNavigation;
