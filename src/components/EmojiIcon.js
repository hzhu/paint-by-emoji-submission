import React from "react";
import { EMOJIS } from "../constants";

const EmojiIcon = ({ emoji }) => (
  <span role="img" aria-label={`${EMOJIS[emoji].name} emoji`}>
    {emoji}
  </span>
);

export default EmojiIcon;
