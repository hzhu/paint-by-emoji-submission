import React from "react";
import { render, cleanup, fireEvent, prettyDOM } from "react-testing-library";
import EmojiPaint from "./emoji-paint";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./constants";
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

test("user should see a error message when changing to grid size to be out of bounds", () => {
  // Given
  const { getByLabelText, queryAllByTestId } = render(<EmojiPaint />);
  const widthInput = getByLabelText("Width");
  const heightInput = getByLabelText("Height");
  const getBoundsError = () => queryAllByTestId("bounds-error");
  expect(getBoundsError()).toEqual([]);

  // When
  fireEvent.change(heightInput, { target: { value: 30 } });

  // Then
  var [heightError] = getBoundsError();
  expect(heightError.textContent).toBe("⚠️ The maximum height is 25");

  // And when
  fireEvent.change(heightInput, { target: { value: -5 } });
  fireEvent.change(widthInput, { target: { value: 99 } });

  // And then
  var [widthError, heightError] = getBoundsError();
  expect(widthError.textContent).toBe("⚠️ The maximum width is 45");
  expect(heightError.textContent).toBe("⚠️ The minimum height is 1");

  // And when
  fireEvent.change(widthInput, { target: { value: -5 } });

  // And then
  var [widthError] = getBoundsError();
  expect(widthError.textContent).toBe("⚠️ The minimum width is 1");
});

test("user should be able to paint (and erase) emojis on the grid", () => {
  // Given (a blank grid)
  const { getByTestId, getByAltText } = render(<EmojiPaint />);
  const grid = getByTestId("grid");
  const brushButton = getByAltText("brush");
  const eraseButton = getByAltText("eraser");
  const firstRowCoords = [[0, 0], [0, 1], [0, 2]];

  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    expect(cell.textContent).toBe("");
  });

  // When (user paints in the first three cells of the first row)
  fireEvent.click(brushButton);
  fireEvent.mouseDown(grid);
  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    fireEvent.mouseEnter(cell);
  });
  fireEvent.mouseUp(grid);

  // Then (the first row is painted with an emoji)
  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    expect(cell.textContent).toBe("😀");
  });

  // And When (user erases the first three cells of the first row)
  fireEvent.click(eraseButton);
  fireEvent.mouseDown(grid);
  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    fireEvent.mouseEnter(cell);
  });
  fireEvent.mouseUp(grid);

  // And Then (the first row is blank)
  firstRowCoords.forEach(coord => {
    const [m, n] = coord;
    const cell = getByTestId(`cell-${m}-${n}`);
    expect(cell.textContent).toBe("");
  });
});
