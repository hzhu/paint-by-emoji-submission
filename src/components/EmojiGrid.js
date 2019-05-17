import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import EmojiCell from "./EmojiCell";

const EmojiGrid = ({ grid, mode, activeEmoji, emptyGrid, setEmptyGrid }) => {
  const ref = useRef({});

  useEffect(() => {
    ref.current.mode = mode;
    ref.current.activeEmoji = activeEmoji;
  }, [mode, activeEmoji]);

  return (
    <div
      data-testid="grid"
      className={`ma3 br3 dib b--gray ${mode ? "pointer" : "not-allowed"}`}
      onMouseUp={() => (ref.current.pressed = false)}
      onMouseDown={() => (ref.current.pressed = true)}
      onMouseLeave={() => (ref.current.pressed = false)}
      onContextMenu={() => (ref.current.pressed = false)}
    >
      {grid.map((row, m) => (
        <div key={m} data-testid={`row-${m}`} className="flex">
          {row.map((_, n) => (
            <EmojiCell
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

EmojiGrid.propTypes = {
  grid: PropTypes.array,
  mode: PropTypes.string,
  activeEmoji: PropTypes.string,
  emptyGrid: PropTypes.bool,
  setEmptyGrid: PropTypes.func
};

export default EmojiGrid;
