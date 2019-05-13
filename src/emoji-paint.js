import React, { useState } from "react";
import EmojiPicker from "./emoji-picker";
import { EMOJIS } from "./constants";

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

  const clearGrid = () => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    const emptyGrid = newGrid.map(row => row.map(cell => ""));
    setGrid(emptyGrid);
  };

  const copyToClipboard = () => {
    let str = ``;
    grid.forEach(row => {
      row.forEach(cell => (str += EMOJIS[cell].shortcode));
      str += "\n";
    });
    navigator.clipboard
      .writeText(str.slice(0, -1))
      .then(() => console.log("Copied to clipboard"))
      .catch(err =>
        window.alert(
          "Could not copy text please try a different web browser: ",
          err
        )
      );
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
    <div className="emoji-paint tc">
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
      <div className="flex justify-end ma3 mt0">
        <button
          onClick={clearGrid}
          className="ph3 br2 fw5 pointer"
          style={{
            border: "1px solid #bfc0c0"
          }}
        >
          Clear
        </button>
        <button
          onClick={copyToClipboard}
          className="f6 fw6 ml2 white ph3 pv3 bn br2 pointer"
          style={{ backgroundColor: "rgb(52, 175, 127)" }}
        >
          Copy to clipboard
        </button>
      </div>
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
    className="ma3 br3 dib pointer"
    style={{
      border: "1px solid #a0a0a2"
    }}
    onMouseDown={() => setIsPainting(true)}
    onMouseUp={() => setIsPainting(false)}
    onContextMenu={() => setIsPainting(false)}
  >
    {grid.map((row, m) => (
      <div key={m} data-testid={`row-${m}`} className="flex">
        {row.map((element, n) => {
          return (
            <span
              key={n}
              role="img"
              className="pa1"
              aria-label={EMOJIS[element].name}
              data-testid={`cell-${m}-${n}`}
              style={{
                fontSize: "37px",
                width: "45px",
                height: "45px",
                userSelect: "none",
                borderRight:
                  n === row.length - 1 ? "none" : "1px solid #d5d5d6",
                borderBottom:
                  m === grid.length - 1 ? "none" : "1px solid #d5d5d6"
              }}
              onMouseDown={() => onGridUpdate(m, n)}
              onMouseEnter={() => {
                if (isPainting) {
                  onGridUpdate(m, n);
                }
              }}
            >
              {element}
            </span>
          );
        })}
      </div>
    ))}
  </div>
);

export default EmojiPaint;
