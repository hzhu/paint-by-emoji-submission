import React from "react";
import { render, cleanup, fireEvent, prettyDOM } from "react-testing-library";
import EmojiPaint, { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./emoji-paint";
import "jest-dom/extend-expect";

afterEach(cleanup);

test("user should be able to adjust size of the grid (e.g. from 10x8 to 3x3)", () => {
  // Given
  const NEW_WIDTH = 3;
  const NEW_HEIGHT = 3;
  const { getByLabelText, getByTestId } = render(<EmojiPaint />);
  const grid = getByTestId("grid");
  const widthInput = getByLabelText("Width");
  const heightInput = getByLabelText("Height");

  expect(grid.children.length).toBe(DEFAULT_HEIGHT);
  for (let i = 0; i < grid.children.length; i++) {
    const row = grid.children[i];
    expect(row.children.length).toBe(DEFAULT_WIDTH);
  }

  // When
  fireEvent.change(widthInput, { target: { value: NEW_WIDTH } });
  fireEvent.change(heightInput, { target: { value: NEW_HEIGHT } });

  // Then
  expect(grid.children.length).toBe(NEW_HEIGHT);
  for (let i = 0; i < grid.children.length; i++) {
    const row = grid.children[i];
    expect(row.children.length).toBe(NEW_WIDTH);
  }
});

test("user should be able to paint emojis on the grid", () => {
  // Given
  const { getByTestId } = render(<EmojiPaint />);
  const grid = getByTestId("grid");
  const firstRowCoords = [[0, 0], [0, 1], [0, 2]];

  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    expect(cell.textContent).toBe("");
  });

  // When (user paints in the first three cells of the first row)
  fireEvent.mouseDown(grid);
  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    fireEvent.mouseEnter(cell);
  });
  fireEvent.mouseUp(grid);

  // Then
  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    expect(cell.textContent).toBe("😀");
  });
});
