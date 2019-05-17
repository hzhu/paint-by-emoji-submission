import React from "react";
import { render, cleanup, fireEvent, prettyDOM } from "react-testing-library";
import App from "./index";
import {
  MAX_WIDTH,
  MAX_HEIGHT,
  MIN_WIDTH,
  MIN_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT
} from "../constants";
import "jest-dom/extend-expect";

afterEach(cleanup);

test("renders the application correctly (snapshot test)", () => {
  const { container } = render(<App />);
  expect(container).toMatchSnapshot();
});

test("user should be able to adjust size of the grid (e.g. from 10x8 to 3x3)", () => {
  // Given
  const NEW_WIDTH = 3;
  const NEW_HEIGHT = 3;
  const { getByLabelText, getByTestId } = render(<App />);
  const grid = getByTestId("grid");
  const widthInput = getByLabelText("Width");
  const heightInput = getByLabelText("Height");

  expect(grid.children.length).toBe(DEFAULT_HEIGHT); // grid starts with default height
  for (let i = 0; i < grid.children.length; i++) {
    const row = grid.children[i];
    expect(row.children.length).toBe(DEFAULT_WIDTH); // grid starts with default width
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
  const { getByLabelText, queryAllByTestId } = render(<App />);
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
  const { getByTestId, getByAltText } = render(<App />);
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
  const { getByText, getByTestId, getByAltText } = render(<App />);
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

test("user should see text indicating current mode when the paint/brush button is selected", () => {
  // Given
  const PAINT_MODE = "You are in painting mode.";
  const ERASING_MODE = "You are in erasing mode.";
  const { getByAltText, queryAllByText } = render(<App />);
  const brushButton = getByAltText("brush");
  const eraseButton = getByAltText("eraser");
  var [modeElement] = queryAllByText(
    (_, { textContent }) => textContent === PAINT_MODE
  );
  expect(modeElement).toBe(undefined);

  // When
  fireEvent.click(brushButton);

  // Then
  var [modeElement] = queryAllByText(
    (_, { textContent }) => textContent === PAINT_MODE
  );
  expect(modeElement.textContent).toBe(PAINT_MODE);

  // And when
  fireEvent.click(eraseButton);

  // And then
  var [modeElement] = queryAllByText(
    (_, { textContent }) => textContent === ERASING_MODE
  );
  expect(modeElement.textContent).toBe(ERASING_MODE);
});
