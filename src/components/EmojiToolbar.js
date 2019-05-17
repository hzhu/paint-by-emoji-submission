import React from "react";
import PropTypes from "prop-types";
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
  <div className="bg-light-gray flex tb-padding">
    <div className="flex-auto relative">
      <EmojiPicker
        value={activeEmoji}
        onSelect={emoji => {
          setActiveEmoji(emoji);
          setMode(MODE.brush);
        }}
      />
      <button
        onClick={() => setMode(MODE.brush)}
        className={`ba br2 b--light-silver pointer dib fl overflow-hidden ep-ctrl ${
          mode === MODE.brush ? "b--green bw1" : ""
        }`}
      >
        <img className="h-100" src="brush.png" alt="brush" />
      </button>
      <button
        onClick={() => setMode(MODE.erase)}
        className={`ba br2 b--light-silver pointer dib fl overflow-hidden ep-ctrl ${
          mode === MODE.erase ? "b--green bw1" : ""
        }`}
      >
        <img className="h-100" src="eraser.png" alt="eraser" />
      </button>
    </div>
    <div>
      <label className="emoji-paint__dimension b ml3">
        Width
        <input
          type="number"
          min={MIN_WIDTH}
          max={MAX_WIDTH}
          onChange={onWidthChange}
          defaultValue={DEFAULT_WIDTH}
          className="ml2 f6 ba b--light-silver br2 tc tb-ctrl-size"
        />
      </label>
      <label className="emoji-paint__dimension b ml3">
        Height
        <input
          type="number"
          min={MIN_HEIGHT}
          max={MAX_HEIGHT}
          onChange={onHeightChange}
          defaultValue={DEFAULT_HEIGHT}
          className="ml2 f6 ba b--light-silver br2 tc tb-ctrl-size"
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

EmojiToolbar.propTypes = {
  mode: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  setMode: PropTypes.func,
  activeEmoji: PropTypes.string,
  setActiveEmoji: PropTypes.func,
  onWidthChange: PropTypes.func,
  onHeightChange: PropTypes.func
};

export default EmojiToolbar;
