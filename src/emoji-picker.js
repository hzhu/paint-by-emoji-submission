import React, { useState } from "react";
import {
  Listbox,
  OptionsList,
  Option,
  DropdownButton,
  CollapsibleDropdown
} from "listbox";
import { EMOJI_PICKER, EMOJIS } from "./constants";
import "./emoji-picker.css";

const visuallyHiddenCSS = {
  border: 0,
  padding: 0,
  width: "1px",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  position: "absolute",
  clip: "rect(0 0 0 0)"
};

const buttonStyle = {
  width: "60px",
  height: "44px",
  float: "left",
  padding: "2px",
  fontSize: "28px",
  cursor: "pointer",
  overflow: "hidden",
  lineHeight: "42px",
  marginRight: "10px",
  borderRadius: "4px",
  display: "inline-block",
  border: "1px solid #AAA"
};

const listboxStyle = {
  top: "50px",
  fontSize: "26px",
  background: "#FFF",
  position: "absolute"
};

export default ({ value, onSelect }) => {
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  return (
    <>
      <CollapsibleDropdown style={{ display: "inline" }}>
        {expanded => (
          <>
            <div style={visuallyHiddenCSS}>
              <span id="emoji_btn_label">Choose an emoji</span>
            </div>
            <DropdownButton
              style={buttonStyle}
              ariaLabelledBy="emoji_btn_label"
            >
              {value}
            </DropdownButton>
            {expanded ? (
              <Listbox
                grid
                focused
                highlight
                activeId={activeId}
                style={listboxStyle}
                activeIndex={activeIndex}
                highlightedIndex={activeIndex}
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
                        <span role="img" aria-label={EMOJIS[emoji].name}>
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
