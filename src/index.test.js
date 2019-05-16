import React from "react";
import { render, cleanup, fireEvent, prettyDOM } from "react-testing-library";
import EmojiPaint from "./emoji-paint";
import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  MAX_WIDTH,
  MAX_HEIGHT,
  MIN_WIDTH,
  MIN_HEIGHT
} from "./constants";
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
  expect(heightError.textContent).toBe(
    `⚠️ The maximum height is ${MAX_HEIGHT}`
  );

  // And when
  fireEvent.change(heightInput, { target: { value: -5 } });
  fireEvent.change(widthInput, { target: { value: 99 } });

  // And then
  var [widthError, heightError] = getBoundsError();
  expect(widthError.textContent).toBe(`⚠️ The maximum width is ${MAX_WIDTH}`);
  expect(heightError.textContent).toBe(
    `⚠️ The minimum height is ${MIN_HEIGHT}`
  );

  // And when
  fireEvent.change(widthInput, { target: { value: -5 } });

  // And then
  var [widthError] = getBoundsError();
  expect(widthError.textContent).toBe(`⚠️ The minimum width is ${MIN_WIDTH}`);
});

test("user should be able to paint (and erase) emojis on the grid", () => {
  // Given (a blank grid)
  const { getByTestId, getByAltText } = render(<EmojiPaint />);
  const grid = getByTestId("grid");
  const brushButton = getByAltText("brush");
  const eraseButton = getByAltText("eraser");
  const firstRowCoords = [[0, 0], [0, 1], [0, 2]];
  const getCell = ([m, n]) => getByTestId(`cell-${m}-${n}`);

  firstRowCoords.forEach(coord => expect(getCell(coord).textContent).toBe(""));

  // When (user paints in the first three cells of the first row)
  fireEvent.click(brushButton);
  fireEvent.mouseDown(grid);
  firstRowCoords.forEach(coord => fireEvent.mouseEnter(getCell(coord)));
  fireEvent.mouseUp(grid);

  // Then (the first row is painted with an emoji)
  firstRowCoords.forEach(coord =>
    expect(getCell(coord).textContent).toBe("😀")
  );

  // And when (user erases the first three cells of the first row)
  fireEvent.click(eraseButton);
  fireEvent.mouseDown(grid);
  firstRowCoords.forEach(coord => fireEvent.mouseEnter(getCell(coord)));
  fireEvent.mouseUp(grid);

  // And then (the first row is blank)
  firstRowCoords.forEach(coord => expect(getCell(coord).textContent).toBe(""));
});

test(`user should be able to clear the grid by selecting the "clear" button`, () => {
  // Given (user paints first three cells of the first row)
  const { getByText, getByTestId, getByAltText } = render(<EmojiPaint />);
  const grid = getByTestId("grid");
  const brushButton = getByAltText("brush");
  const firstRowCoords = [[0, 0], [0, 1], [0, 2]];
  const getCell = ([m, n]) => getByTestId(`cell-${m}-${n}`);
  firstRowCoords.forEach(coord => expect(getCell(coord).textContent).toBe(""));
  fireEvent.click(brushButton);
  fireEvent.mouseDown(grid);
  firstRowCoords.forEach(coord => fireEvent.mouseEnter(getCell(coord)));
  fireEvent.mouseUp(grid);
  firstRowCoords.forEach(coord =>
    expect(getCell(coord).textContent).toBe("😀")
  );

  // When (user selects the "Clear" button)
  const clearButton = getByText("Clear");
  fireEvent.click(clearButton);

  // Then (the painted cells are emptied)
  firstRowCoords.forEach(coord => expect(getCell(coord).textContent).toBe(""));
});
