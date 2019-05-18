import { EMOJIS, DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./constants";

export const makeGrid = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
  return [...Array(height)].map(() => [...Array(width)].map(() => ""));
};

export const copyToClipboard = async grid => {
  let str = ``;
  grid.forEach((row, m) => {
    row.forEach((_, n) => {
      const key = document.querySelector(`[data-testid='cell-${m}-${n}']`)
        .textContent;
      str += EMOJIS[key].shortcode;
    });
    str += "\n";
  });

  try {
    await navigator.clipboard.writeText(str.slice(0, -1));
    console.log("Copied to clipboard");
  } catch (error) {
    window.alert("Could not copy text please try a different web browser.");
    console.error(error);
  }
};
