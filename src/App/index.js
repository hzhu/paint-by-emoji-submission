import React, { useState } from "react";
import EmojiToolbar from "../components/EmojiToolbar";
import ModePanel from "../components/ModePanel";
import EmojiGrid from "../components/EmojiGrid";
import EmojiFooter from "../components/EmojiFooter";
import {
  MODE,
  MIN_WIDTH,
  MIN_HEIGHT,
  MAX_WIDTH,
  MAX_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT
} from "../constants";
import { makeGrid, copyToClipboard } from "../util";

import "./index.css";

const App = () => {
  const [mode, setMode] = useState();
  const [grid, setGrid] = useState(makeGrid);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isPainting, setIsPainting] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState("😀");
  const [emptyGrid, setEmptyGrid] = useState(false);

  const onClear = () => {
    if (mode === MODE.erase) setMode(MODE.brush);
    setEmptyGrid(true);
  };

  const onHeightChange = e => {
    if (!e.target.value) return;
    const nextHeight = Number(e.target.value);
    setHeight(nextHeight);
    if (nextHeight > MAX_HEIGHT || nextHeight < MIN_HEIGHT) return;
    const nextGrid = makeGrid(width, nextHeight);
    setGrid(nextGrid);
  };

  const onWidthChange = e => {
    if (!e.target.value) return;
    const nextWidth = Number(e.target.value);
    setWidth(nextWidth);
    if (nextWidth > MAX_WIDTH || nextWidth < MIN_WIDTH) return;
    const nextGrid = makeGrid(nextWidth, height);
    setGrid(nextGrid);
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
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
          setActiveEmoji={setActiveEmoji}
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
