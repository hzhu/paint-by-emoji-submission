import React, { useState } from "react";
import EmojiPicker from "./emoji-picker";

import "./emoji-paint.css";

export const DEFAULT_HEIGHT = 8;
export const DEFAULT_WIDTH = 10;

const EmojiPaint = () => {
  const [activeEmoji, setActiveEmoji] = useState("😀");
  const [isPainting, setIsPainting] = useState(false);
  const [grid, setGrid] = useState(
    [...Array(DEFAULT_HEIGHT)].map(row =>
      [...Array(DEFAULT_WIDTH)].map(() => "")
    )
  );

  const onGridUpdate = (m, n) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[m][n] = activeEmoji;
    setGrid(newGrid);
  };

  const onHeightChange = e => {
    if (!e.target.value) return;
    const newGrid = JSON.parse(JSON.stringify(grid));
    const currRows = grid.length;
    const nextRows = Number(e.target.value);
    if (nextRows > currRows) {
      const rowsToAdd = nextRows - currRows;
      for (let i = 0; i < rowsToAdd; i++) {
        const width = newGrid[0].length;
        newGrid.push([...Array(width)].map(() => ""));
      }
    } else {
      const rowsToRemove = currRows - nextRows;
      for (let i = 0; i < rowsToRemove; i++) {
        newGrid.pop();
      }
    }
    setGrid(newGrid);
  };

  const onWidthChange = e => {
    if (!e.target.value) return;
    const newGrid = JSON.parse(JSON.stringify(grid));
    const currCols = grid[0].length;
    const nextCols = Number(e.target.value);
    if (nextCols > currCols) {
      const colsToAdd = nextCols - currCols;
      for (let i = 0; i < colsToAdd; i++) {
        newGrid.forEach(row => row.push(""));
      }
    } else {
      const colsToRemove = currCols - nextCols;
      for (let i = 0; i < colsToRemove; i++) {
        newGrid.forEach(row => row.pop());
      }
    }
    setGrid(newGrid);
  };

  return (
    <div className="emoji-paint">
      <EmojiToolbar
        activeEmoji={activeEmoji}
        setActiveEmoji={setActiveEmoji}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
      />
      <EmojiGrid
        grid={grid}
        isPainting={isPainting}
        setIsPainting={setIsPainting}
        onGridUpdate={onGridUpdate}
      />
    </div>
  );
};

const EmojiToolbar = ({
  activeEmoji,
  setActiveEmoji,
  onWidthChange,
  onHeightChange
}) => (
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
          onChange={onWidthChange}
          defaultValue={DEFAULT_WIDTH}
        />
      </label>
      <label className="emoji-paint__dimension">
        Height
        <input
          type="number"
          className="emoji-paint__dimension_input"
          onChange={onHeightChange}
          defaultValue={DEFAULT_HEIGHT}
        />
      </label>
    </div>
  </div>
);

const EmojiGrid = ({ grid, onGridUpdate, isPainting, setIsPainting }) => (
  <div
    data-testid="grid"
    onMouseDown={() => setIsPainting(true)}
    onMouseUp={() => setIsPainting(false)}
  >
    {grid.map((row, m) => (
      <div key={m} data-testid={`row-${m}`} className="row flex">
        {row.map((element, n) => (
          <div
            key={n}
            className="pa1"
            style={{ userSelect: "none" }}
            onMouseDown={() => onGridUpdate(m, n)}
            onMouseEnter={() => {
              if (isPainting) {
                onGridUpdate(m, n);
              }
            }}
          >
            {element}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default EmojiPaint;
