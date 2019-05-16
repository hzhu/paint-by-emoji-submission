import React from "react";
import EmojiPicker from "./EmojiPicker";
import EmojiIcon from "./EmojiIcon";
import {
  MODE,
  MIN_WIDTH,
  MIN_HEIGHT,
  MAX_WIDTH,
  MAX_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT
} from "../constants";

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

export default EmojiToolbar;
