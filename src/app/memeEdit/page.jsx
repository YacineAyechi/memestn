"use client";

import { Stage, Layer, Text } from "react-konva";
import Konva from "konva";
import { useState } from "react";

const MemeEditor = ({ value, onChange }) => {
  const [textPosition, setTextPosition] = useState({ x: 10, y: 10 });

  const handleTextChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="mt-4">
      <textarea
        className="border border-gray-300 rounded-lg p-2 w-full"
        placeholder="Add text to your meme..."
        value={value}
        onChange={handleTextChange}
      />
      <div className="mt-4">
        <Stage width={400} height={200}>
          <Layer>
            {/* Display text on meme */}
            <Text
              text={value}
              fontSize={24}
              fontFamily="Arial"
              fill="black"
              x={textPosition.x}
              y={textPosition.y}
              draggable
              onDragEnd={(e) => {
                setTextPosition({ x: e.target.x(), y: e.target.y() });
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default MemeEditor;
