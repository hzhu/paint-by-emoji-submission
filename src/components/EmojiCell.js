import React, { useState, useEffect } from "react";
import { EMOJIS, MODE } from "../constants";

const Cell = React.forwardRef(({ m, n, emptyGrid, setEmptyGrid }, ref) => {
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
      className="pa1 usn cell"
      aria-label={EMOJIS[content].name}
      data-testid={`cell-${m}-${n}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      {content}
    </span>
  );
});

const areEqual = (prevProps, nextProps) => {
  // React.memo() is used to memoize a component by shallow comparing its props
  // to determine if it needs a render. Here, it is used as an escape hatch so
  // that each cell only renders based on its internal component state. State
  // updates to parent components will not cause a render to the cells if `true`
  // is returned from this `areEqual` function.

  // This is improves rendering performance if the canvas is a 500x500 grid.
  // We do not want to re-render 250,000 cells upon parent component state
  // changes. For example, if the user selects the brush mode, and state for
  // <EmojiPaint /> updates, it forces the entire subtree to re-render. That
  // subtree could contain 250,000 grid cell components.

  if (prevProps.emptyGrid !== nextProps.emptyGrid) {
    // We want to control cells to reset their state when a user clicks the
    // "Clear" button. Returning `false` here forces the children to render
    // to it's initial empty state.
    return false;
  }

  return true;
};

// See: https://reactjs.org/docs/react-api.html#reactmemo
const EmojiCell = React.memo(Cell, areEqual);

export default EmojiCell;
