export enum ToggleButtonType {
  TYPE_1 = 'TYPE_1',
  TYPE_2 = 'TYPE_2'
}
const ToggleButton = (props: { type: ToggleButtonType }) => {
  return (
    <button
      className="rounded-[5px] py-[3px] px-[7px]"
      style={{
        background: '#FFFFFF',
        boxShadow:
          '0px 0.5px 2.5px 0px rgba(0, 0, 0, 0.30), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.05)'
      }}
    >
      Label
    </button>
  );
};

export default ToggleButton;
