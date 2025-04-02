import { useEffect, useState } from 'react';
import { Popover } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { MouseIcon } from 'lucide-react';

import { mouseModeAtom, mouseStyleAtom, scrollDirectionAtom } from '@/jotai/mouse.ts';
import * as storage from '@/libs/storage';

import { Direction } from './direction.tsx';
import { Mode } from './mode.tsx';
import { Style } from './style.tsx';

export const Mouse = () => {
  const [mouseStyle, setMouseStyle] = useAtom(mouseStyleAtom);
  const [mouseMode, setMouseMode] = useAtom(mouseModeAtom);
  const setScrollDirection = useSetAtom(scrollDirectionAtom);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const style = storage.getMouseStyle();
    if (style && style !== mouseStyle) {
      setMouseStyle(style);
    }

    const mode = storage.getMouseMode();
    if (mode && mode !== mouseMode) {
      setMouseMode(mode);
    }

    const direction = storage.getMouseScrollDirection();
    if (direction && Number(direction)) {
      setScrollDirection(Number(direction));
    }
  }, []);

  const content = (
    <>
      <Style />
      <Mode />
      <Direction />
    </>
  );

  return (
    <Popover
      content={content}
      placement="bottomLeft"
      trigger="click"
      arrow={false}
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <div className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded text-white hover:bg-neutral-700/70">
        <MouseIcon size={18} />
      </div>
    </Popover>
  );
};
