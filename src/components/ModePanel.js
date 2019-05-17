import React from "react";
import { MODE } from "../constants";
import PropTypes from "prop-types";

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

export default ModePanel;

ModePanel.propTypes = {
  mode: PropTypes.string
};
