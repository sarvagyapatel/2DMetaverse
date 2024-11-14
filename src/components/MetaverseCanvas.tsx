// src/components/MetaverseCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import officeBackground from '../assets/floor.jpg'; 
import actor from '../assets/actor.png';

const OFFICE_WIDTH = 1100;
const OFFICE_HEIGHT = 900;
const CHARACTER_SIZE = 5;
const MOVE_STEP = 5;

const MetaverseCanvas: React.FC = () => {
  const [position, setPosition] = useState({ x: OFFICE_WIDTH / 2, y: OFFICE_HEIGHT / 2 });
  const stageRef = useRef<never>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backgroundRef = useRef<any>(null);
  const characterRef = useRef<any>(null);

  // Preload the image
  useEffect(() => {
    const bgImage = new window.Image();
    bgImage.src = officeBackground;
    bgImage.onload = () => {
      backgroundRef.current = bgImage;
      // Force re-render to display the loaded image
      setImageLoaded(true);
    };

    const actorImage = new window.Image();
    actorImage.src = actor;
    actorImage.onload = () => {
        characterRef.current = actorImage;
      // Force re-render to display the loaded image
      setImageLoaded(true);
    };
  }, []);

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    setPosition((prev) => {
      let { x, y } = prev;
      if (e.key === 'ArrowUp') y = Math.max(y - MOVE_STEP, CHARACTER_SIZE);
      if (e.key === 'ArrowDown') y = Math.min(y + MOVE_STEP, OFFICE_HEIGHT - CHARACTER_SIZE);
      if (e.key === 'ArrowLeft') x = Math.max(x - MOVE_STEP, CHARACTER_SIZE);
      if (e.key === 'ArrowRight') x = Math.min(x + MOVE_STEP, OFFICE_WIDTH - CHARACTER_SIZE);
      return { x, y };
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex justify-center items-center bg-gray-700 h-screen">
      <Stage width={OFFICE_WIDTH} height={OFFICE_HEIGHT} ref={stageRef} className="border-2 border-gray-300 bg-white">
        <Layer>
          {/* Background Image */}
          {imageLoaded && (
            <KonvaImage
              x={0}
              y={0}
              width={OFFICE_WIDTH}
              height={OFFICE_HEIGHT}
              image={backgroundRef.current}
            />
          )}

          {/* Add Desks */}
          {/* {[{ x: 100, y: 100 }, { x: 300, y: 200 }, { x: 500, y: 100 }].map((desk, index) => (
            <Rect
              key={index}
              x={desk.x}
              y={desk.y}
              width={100}
              height={60}
              fill="#8B4513"
              cornerRadius={10}
            />
          ))} */}

          {/* Add Chairs */}
          {/* {[{ x: 100, y: 160 }, { x: 300, y: 260 }, { x: 500, y: 160 }].map((chair, index) => (
            <Rect
              key={index}
              x={chair.x}
              y={chair.y}
              width={40}
              height={40}
              fill="#654321"
              cornerRadius={5}
            />
          ))} */}

          {/* Add Character */}
          <KonvaImage
            x={position.x}
            y={position.y}
            radius={CHARACTER_SIZE}
            shadowBlur={10}
            width={130}
            height={130}
            image={characterRef.current}
          />

          {/* Optional: Add Labels */}
          {/* <Text text="Office Space" fontSize={24} x={OFFICE_WIDTH / 2 - 80} y={20} /> */}
        </Layer>
      </Stage>
    </div>
  );
};

export default MetaverseCanvas;
