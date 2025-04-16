import { Test } from '../../../../icons/src';

enum PopoverType {
  ARROW_WEST_TOP = 'ARROW_WEST_TOP',
  ARROW_NORTH_LEFT = 'ARROW_NORTH_LEFT',
  ARROW_NORTH_MIDDLE = 'ARROW_NORTH_MIDDLE',
  ARROW_NORTH_RIGHT = 'ARROW_NORTH_RIGHT',
  ARROW_EAST_TOP = 'ARROW_EAST_TOP',
  ARROW_EAST_MIDDLE = 'ARROW_EAST_MIDDLE',
  ARROW_EAST_BOTTOM = 'ARROW_EAST_BOTTOM',
  ARROW_SOUTH_LEFT = 'ARROW_SOUTH_LEFT',
  ARROW_SOUTH_MIDDLE = 'ARROW_SOUTH_MIDDLE',
  ARROW_SOUTH_RIGHT = 'ARROW_SOUTH_RIGHT',
  ARROW_WEST_BOTTOM = 'ARROW_WEST_BOTTOM',
  ARROW_WEST_MIDDLE = 'ARROW_WEST_MIDDLE'
}

const Popover = () => {
  return (
    <div
      className="w-[200px] h-[200px]"
      style={{
        fill: '#FFF',
        mixBlendMode: 'multiply',
        filter:
          'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.55)) drop-shadow(0px 8px 40px rgba(0, 0, 0, 0.25))'
      }}
    >
      <Test />
    </div>
  );
};

export default Popover;
