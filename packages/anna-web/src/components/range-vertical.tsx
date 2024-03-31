import React from 'react';
import Typography from '@/components/typography';

import { getPercentage } from '@/utils';

type Position = {
  top: number;
  bottom: number;
};
function usePosition(ref: React.RefObject<HTMLDivElement>) {
  const [position, setPosition] = React.useState<Position>({
    top: 0,
    bottom: 0,
  });

  React.useEffect(() => {
    const domRect = ref.current?.getBoundingClientRect();
    if (domRect) {
      setPosition({ top: domRect.top, bottom: domRect.bottom });
    }
  }, [ref]);

  return position;
}

const RangeVertical: React.FC<{
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}> = ({ min, max, value, onChange }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { top, bottom } = usePosition(ref);

  const percentage = getPercentage(min, max)(value);
  const getValue = getPercentage(top, bottom);

  function handleMove(event: React.TouchEvent<HTMLDivElement> | MouseEvent) {
    // @ts-ignore
    const { clientY } = event.touches ? event.touches[0] : event;
    const percentage = 100 - getValue(clientY);

    const newValue = (percentage * (max - min)) / 100 + min;
    onChange(newValue);
  }

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', cleanup);
  };

  const cleanup = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', cleanup);
  };

  const displayValue = `${percentage}%`;
  return (
    <div className="my-6 flex flex-col justify-center items-center">
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onTouchMove={handleMove}
        className="relative bg-gray-800 rounded h-56 w-24"
      >
        <div
          className="bg-teal-500 rounded absolute bottom-0 left-0 right-0 w-24 text-center"
          style={{ height: displayValue }}
        />
      </div>
      <Typography className="mt-2">Brightness: {displayValue}</Typography>
    </div>
  );
};

export default RangeVertical;
