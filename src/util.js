import { EMOJIS } from "./constants";

export const copyToClipboard = grid => {
  let str = ``;
  grid.forEach((row, m) => {
    row.forEach((_, n) => {
      const key = document.querySelector(`[data-testid='cell-${m}-${n}']`)
        .innerText;
      str += EMOJIS[key].shortcode;
    });
    str += "\n";
  });

  navigator.clipboard
    .writeText(str.slice(0, -1))
    .then(() => console.log("Copied to clipboard"))
    .catch(err =>
      window.alert(
        "Could not copy text please try a different web browser: ",
        err
      )
    );
};
