const Tooltip = () => {
  return (
    <div
      style={{
        padding: '3px 6px',
        borderRadius: '1px',
        background: 'var(--Materials-Thick, rgba(246, 246, 246, 0.72))',
        boxShadow:
          '0px 0px 0px 0.5px rgba(0, 0, 0, 0.12), 0px 2px 6px 0px rgba(0, 0, 0, 0.20)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <span
        style={{
          color: '#4D4D4D',
          fontFamily: 'SF Pro',
          fontSize: '11px',
          fontStyle: 'normal',
          fontWeight: '510',
          lineHeight: '13px'
        }}
      >
        This is a tooltip.
      </span>
    </div>
  );
};

export default Tooltip;
