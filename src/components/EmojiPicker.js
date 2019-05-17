import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Listbox,
  OptionsList,
  Option,
  DropdownButton,
  CollapsibleDropdown
} from "listbox";
import { EMOJI_PICKER, EMOJIS } from "../constants";

const EmojiPicker = ({ value, onSelect }) => {
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  return (
    <>
      <CollapsibleDropdown style={{ display: "inline" }}>
        {expanded => (
          <>
            <span id="emoji_btn_label" className="visually-hidden">
              Choose an emoji
            </span>
            <DropdownButton
              ariaLabelledBy="emoji_btn_label"
              className="br2 fl pointer b--light-silver ep-btn"
            >
              {value}
            </DropdownButton>
            {expanded ? (
              <Listbox
                grid
                focused
                highlight
                activeId={activeId}
                activeIndex={activeIndex}
                highlightedIndex={activeIndex}
                className="bg-white absolute lb"
                ariaLabelledBy="emoji_btn_label"
                updateValue={({ activeId, activeIndex, selectedItem }) => {
                  onSelect(selectedItem);
                  setActiveId(activeId);
                  setActiveIndex(activeIndex);
                }}
              >
                {EMOJI_PICKER.map((row, m) => (
                  <OptionsList key={m} style={{ display: "flex" }}>
                    {row.map((emoji, n) => (
                      <Option
                        key={n}
                        className="pointer"
                        style={{ padding: "5px 5px 2px 5px" }}
                        onMouseEnter={(index, id) => {
                          setActiveId(id);
                          setActiveIndex(index);
                        }}
                      >
                        <span
                          role="img"
                          aria-label={`${EMOJIS[emoji].name} emoji`}
                        >
                          {emoji}
                        </span>
                      </Option>
                    ))}
                  </OptionsList>
                ))}
              </Listbox>
            ) : null}
          </>
        )}
      </CollapsibleDropdown>
    </>
  );
};

EmojiPicker.propTypes = {
  value: PropTypes.string,
  onSelect: PropTypes.func
};

export default EmojiPicker;
