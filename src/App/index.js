import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "../emoji-picker";
import {
  MODE,
  EMOJIS,
  MIN_WIDTH,
  MIN_HEIGHT,
  MAX_WIDTH,
  MAX_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT
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

  return (
    <div className="app">
      <div className="emoji-paint tc">
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
            onClick={() => setEmptyGrid(true)}
            className="ph3 br2 fw5 pointer"
            style={{
              border: "1px solid #bfc0c0"
            }}
          >
            Clear
          </button>
          <button
            onClick={() => copyToClipboard(grid)}
            className="f6 fw6 ml2 white ph3 pv3 bn br2 pointer"
            style={{ backgroundColor: "rgb(52, 175, 127)" }}
          >
            Copy to clipboard
          </button>
        </div>
        <div className="pa3">
          <span>
            Learn how to add a <em>:blank:</em> emoji to your Slack workspace{" "}
            <a
              className="link bg-animate hover-bg-lightest-blue"
              href="https://get.slack.help/hc/en-us/articles/206870177-Add-custom-emoji"
            >
              here
            </a>
            !
          </span>
        </div>
      </div>
    </div>
  );
};

const EmojiToolbar = ({
  mode,
  width,
  height,
  setMode,
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
      <button
        onClick={() => setMode(MODE.brush)}
        className={`emoji-paint__control ${
          mode === MODE.brush ? "b--green bw1" : ""
        }`}
      >
        <img
          className="emoji-paint__control_icon"
          src="brush.png"
          alt="brush"
        />
      </button>
      <button
        onClick={() => setMode(MODE.erase)}
        className={`emoji-paint__control ${
          mode === MODE.erase ? "b--green bw1" : ""
        }`}
      >
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
          min={MIN_WIDTH}
          max={MAX_WIDTH}
          type="number"
          className="emoji-paint__dimension_input"
          onChange={onWidthChange}
          defaultValue={DEFAULT_WIDTH}
        />
      </label>
      <label className="emoji-paint__dimension">
        Height
        <input
          min={MIN_HEIGHT}
          max={MAX_HEIGHT}
          type="number"
          className="emoji-paint__dimension_input"
          onChange={onHeightChange}
          defaultValue={DEFAULT_HEIGHT}
        />
      </label>
      <div className="dark-red pt2 tl">
        <div aria-live="polite">
          {width > MAX_WIDTH ? (
            <span data-testid="bounds-error">
              <EmojiIcon emoji="⚠️" /> The maximum width is {MAX_WIDTH}
            </span>
          ) : width < MIN_WIDTH ? (
            <span data-testid="bounds-error">
              <EmojiIcon emoji="⚠️" /> The minimum width is {MIN_WIDTH}
            </span>
          ) : null}
        </div>
        <div aria-live="polite">
          {height > MAX_HEIGHT ? (
            <span data-testid="bounds-error">
              <EmojiIcon emoji="⚠️" /> The maximum height is {MAX_HEIGHT}
            </span>
          ) : height < MIN_HEIGHT ? (
            <span data-testid="bounds-error">
              <EmojiIcon emoji="⚠️" /> The minimum height is {MIN_HEIGHT}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  </div>
);

const EmojiIcon = ({ emoji }) => (
  <span role="img" aria-label={`${EMOJIS[emoji].name} emoji`}>
    {emoji}
  </span>
);

const Comp = React.forwardRef(({ m, n, emptyGrid, setEmptyGrid }, ref) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (emptyGrid) {
      setContent("");
      setEmptyGrid(false);
    }
  }, [emptyGrid, setEmptyGrid]);

  const onMouseDown = () => {
    if (ref.current.mode === MODE.brush) {
      setContent(ref.current.activeEmoji);
    } else {
      setContent("");
    }
  };

  const onMouseEnter = () => {
    if (ref.current.pressed) {
      if (ref.current.mode === MODE.brush) {
        setContent(ref.current.activeEmoji);
      } else {
        setContent("");
      }
    }
  };
  return (
    <span
      key={n}
      role="img"
      className="pa1"
      aria-label={EMOJIS[content].name}
      data-testid={`cell-${m}-${n}`}
      style={{
        width: "45px",
        height: "45px",
        fontSize: "37px",
        userSelect: "none",
        borderRight: "1px solid #d5d5d6",
        borderBottom: "1px solid #d5d5d6"
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      {content}
    </span>
  );
});
function areEqual(prevProps, nextProps) {
  // See: https://reactjs.org/docs/react-api.html#reactmemo

  // React.memo() is used to memoize a component by shallow comparing it's props.
  // Here, it is used as an escape hatch so that each cell only renders based
  // on its internal component state. State updates to parent components
  // will not cause a render to the cells if `true` is returned from this `areEqual`
  // function.

  // This is improves rendering performance if the canvas is a 500x500 grid.
  // We do not want to re-render 250,000 cells upon parent component state
  // changes. For example, if the user selects the brush mode, and state for
  // <EmojiPaint /> updates, it forces the entire subtree to re-render. That
  // subtree could contain 250,000 grid cell components.

  if (prevProps.emptyGrid !== nextProps.emptyGrid) {
    // We want to control when cells reset their state when a user clicks the
    // "Clear" button. Returning `false` here forces the children to render
    // to it's initial empty state.
    return false;
  }

  return true;
}
const GridCell = React.memo(Comp, areEqual);

const EmojiGrid = ({ grid, mode, activeEmoji, emptyGrid, setEmptyGrid }) => {
  const ref = useRef({});

  useEffect(() => {
    ref.current.mode = mode;
    ref.current.activeEmoji = activeEmoji;
  }, [mode, activeEmoji]);

  return (
    <div
      data-testid="grid"
      className={`ma3 br3 dib ${mode ? "pointer" : "not-allowed"}`}
      style={{
        border: "1px solid #a0a0a2"
      }}
      onMouseUp={() => (ref.current.pressed = false)}
      onMouseDown={() => (ref.current.pressed = true)}
      onMouseLeave={() => (ref.current.pressed = false)}
      onContextMenu={() => (ref.current.pressed = false)}
    >
      {grid.map((row, m) => (
        <div key={m} data-testid={`row-${m}`} className="flex">
          {row.map((cell, n) => (
            <GridCell
              m={m}
              n={n}
              key={n}
              ref={ref}
              emptyGrid={emptyGrid}
              setEmptyGrid={setEmptyGrid}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const ModePanel = ({ mode }) => (
  <div
    className="pb3"
    style={{
      background: "#F9F9F9"
    }}
    aria-live="polite"
  >
    {mode ? (
      <span>
        You are in{" "}
        <strong>{mode === MODE.brush ? "painting" : "erasing"}</strong> mode.
      </span>
    ) : null}
  </div>
);

export default App;
