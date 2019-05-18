import React, { useState } from "react";
import EmojiToolbar from "../components/EmojiToolbar";
import ModePanel from "../components/ModePanel";
import EmojiGrid from "../components/EmojiGrid";
import EmojiFooter from "../components/EmojiFooter";
import {
  MIN_WIDTH,
  MIN_HEIGHT,
  MAX_WIDTH,
  MAX_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  MODE
} from "../constants";
import { copyToClipboard } from "../util";

import "./index.css";

const App = () => {
  const [mode, setMode] = useState();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isPainting, setIsPainting] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState("😀");
  const [grid, setGrid] = useState(
    [...Array(DEFAULT_HEIGHT)].map(() =>
      [...Array(DEFAULT_WIDTH)].map(() => "")
    )
  );
  const [emptyGrid, setEmptyGrid] = useState(false);

  const onHeightChange = e => {
    if (!e.target.value) return;
    const newGrid = JSON.parse(JSON.stringify(grid));
    const currHeight = grid.length;
    const nextHeight = Number(e.target.value);
    setHeight(nextHeight);
    if (nextHeight > MAX_HEIGHT || nextHeight < MIN_HEIGHT) return;
    if (nextHeight > currHeight) {
      const rowsToAdd = nextHeight - currHeight;
      for (let i = 0; i < rowsToAdd; i++) {
        const width = newGrid[0].length;
        newGrid.push([...Array(width)].map(() => ""));
      }
    } else {
      const rowsToRemove = currHeight - nextHeight;
      for (let i = 0; i < rowsToRemove; i++) {
        newGrid.pop();
      }
    }
    setGrid(newGrid);
  };

  const onWidthChange = e => {
    if (!e.target.value) return;
    const newGrid = JSON.parse(JSON.stringify(grid));
    const currWidth = grid[0].length;
    const nextWidth = Number(e.target.value);
    setWidth(nextWidth);
    if (nextWidth > MAX_WIDTH || nextWidth < MIN_WIDTH) return;
    if (nextWidth > currWidth) {
      const colsToAdd = nextWidth - currWidth;
      for (let i = 0; i < colsToAdd; i++) {
        newGrid.forEach(row => row.push(""));
      }
    } else {
      const colsToRemove = currWidth - nextWidth;
      for (let i = 0; i < colsToRemove; i++) {
        newGrid.forEach(row => row.pop());
      }
    }
    setGrid(newGrid);
  };

  const onClear = () => {
    if (mode === MODE.erase) setMode(MODE.brush);
    setEmptyGrid(true);
  };

  return (
    <div className="app flex items-center flex-column justify-center h-100">
      <div className="bg-white shadow-x-1 tc br3 ba b--light-silver overflow-hidden">
        <EmojiToolbar
          mode={mode}
          width={width}
          height={height}
          setMode={setMode}
          activeEmoji={activeEmoji}
          setActiveEmoji={setActiveEmoji}
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
        />
        <ModePanel mode={mode} />
        <EmojiGrid
          grid={grid}
          mode={mode}
          emptyGrid={emptyGrid}
          setEmptyGrid={setEmptyGrid}
          activeEmoji={activeEmoji}
          isPainting={isPainting}
          setIsPainting={setIsPainting}
        />
        <div className="flex justify-end mh3">
          <button
            onClick={onClear}
            className="ph3 br2 fw5 pointer b--light-silver"
          >
            Clear
          </button>
          <button
            onClick={() => copyToClipboard(grid)}
            className="f6 fw6 ml2 white ph3 pv3 bn br2 pointer bg-light-green"
          >
            Copy to clipboard
          </button>
        </div>
        <EmojiFooter />
      </div>
    </div>
  );
};

export default App;
