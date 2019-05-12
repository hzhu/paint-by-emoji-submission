import React from "react";
import { render, cleanup, fireEvent, prettyDOM } from "react-testing-library";
import EmojiPaint, { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./emoji-paint";
import "jest-dom/extend-expect";

afterEach(cleanup);

test("user should be able to adjust the size of the emoji grid (e.g. 3x3)", () => {
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
