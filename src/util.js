import { EMOJIS } from "./constants";

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
