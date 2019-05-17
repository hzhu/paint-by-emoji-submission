import React from "react";
import PropTypes from "prop-types";
import { EMOJIS } from "../constants";

const EmojiIcon = ({ emoji }) => (
  <span role="img" aria-label={`${EMOJIS[emoji].name} emoji`}>
    {emoji}
  </span>
);

EmojiIcon.propTypes = {
  emoji: PropTypes.string
};

export default EmojiIcon;
