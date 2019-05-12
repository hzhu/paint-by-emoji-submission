import React, { useState } from "react";
import EmojiPicker from "./emoji-picker";

import "./emoji-paint.css";

const DEFAULT_HEIGHT = 8;
const DEFAULT_WIDTH = 10;

const EmojiPaint = () => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [activeEmoji, setActiveEmoji] = useState("😀");

  return (
    <div className="emoji-paint">
      <div className="emoji-paint__toolbar">
        <div className="emoji-paint__controls">
          <EmojiPicker
            value={activeEmoji}
            onSelect={emoji => setActiveEmoji(emoji)}
          />
          <button className="emoji-paint__control">
            <img
              className="emoji-paint__control_icon"
              src="brush.png"
              alt="brush"
            />
          </button>
          <button className="emoji-paint__control">
            <img
              className="emoji-paint__control_icon"
              src="eraser.png"
              alt="eraser"
            />
          </button>
        </div>
        <div>
          <label className="emoji-paint__dimension">
            Width
            <input
              type="number"
              className="emoji-paint__dimension_input"
              onChange={e => setWidth(Number(e.target.value))}
              defaultValue={width}
            />
          </label>
          <label className="emoji-paint__dimension">
            Height
            <input
              type="number"
              className="emoji-paint__dimension_input"
              onChange={e => setHeight(Number(e.target.value))}
              defaultValue={height}
            />
          </label>
        </div>
      </div>
      <EmojiGrid height={height} width={width} />
    </div>
  );
};

const EmojiGrid = ({ height, width }) => (
  <div>
    {[...Array(height)]
      .map((_, row) => ({ children }) => (
        <div key={row} className="row flex">
          {children}
        </div>
      ))
      .map((Comp, i) => (
        <Comp key={i}>
          {[...Array(width)].map((_, col) => (
            <div key={col} className="pa1">
              CELL
            </div>
          ))}
        </Comp>
      ))}
  </div>
);

export default EmojiPaint;
