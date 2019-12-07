👋 Henry Zhu | [GitHub](https://github.com/hzhu) | [Twitter](http://twitter.com/henballs)

**Live Web Application: [https://paint-by-emoji.surge.sh](http://paint-by-emoji.surge.sh)** 

Quick start:

```
npm install
npm start
```

Run tests:
```
npm test
```

## File Organization

```
src
├── index.js          // Entry point to the application.
├── constants.js      // Constants used in the source code and tests.
└── utils.js          // Small helper functions that are React agnostic.
└── App          
  ├── index.js        // The main <App>. Composed of small components. Application state is located here.
  ├── index.css       // Small CSS classes used to visually style the application.
  ├── index.test.js   // Tests for the application .
  └── __snapshots__   // Snapshot test file(s).
└── components       
  ├── EmojiCell       // Renders a single cell that has its own component state.        
  ├── EmojiGrid       // Renders a grid.    
  ├── EmojiFooter     // Helpful information to the user.      
  ├── EmojiIcon       // An accessible Emoji.      
  ├── EmojiPicker     // An accessible Emoji picker.       
  ├── EmojiToolbar    // Renders a toolbar with options which the user can select.      
  └── ModePanel       // Renders UI that communicates what mode the user is in.       
```


## Dependency Choices

I updated React and ReactDOM to the latest versions. I installed a testing library [recommended by the React docs](https://reactjs.org/docs/test-utils.html#overview) called `react-testing-library`. I added my own [listbox](https://www.github.com/hzhu/listbox) component library which I used to build the emoji picker.

## Unit Testing

⚠️ Tests are located in [`/src/App/index.test.js`](https://github.com/SlackRecruiting/fe-code-exercise-104563275/blob/h/final/src/App/index.test.js#L1).

![Test cases](https://i.imgur.com/xSmFcKR.png)

I use Enzyme for component testing day to day at work, but decided this would be a great opportunity to use a new testing library recommended by React called `react-testing-library`. These were my guiding principles while writing the tests:

⭐ The more my tests resemble the way the software is used, the more confidence I gain from these tests.

⭐ I would like to avoid testing implementation details. The user of my software does not care about the implementation details.

⭐ My test descriptions should generally be written in a declarative fashion and be free of programming jargon. The project’s product manager should be able to read and understand the test description.

⭐ I should be thoughtful about using mocks because while mocking is a useful technique, it can sometimes be overused. I should always ask myself what value does the test gain (and lose) from mocking a dependency.

⭐ I strive to colocate dependencies inside a test block. It allows me to focus solely on the test block and discourages coupling test blocks to outside dependencies. I favor declaring variables within a test block, rather than declaring a single variable at the top of the file that is shared amongst all test blocks.

## Accessibility

I used this project as an opportunity to practice writing accessible web applications. Some highlights are:

* When a user encounters a grid sizing error, the error messages are read aloud on screen readers.

* When a user selects the brush or erase button, the button becomes visually outlined with a green border to indicate whether they can paint or erase. "You are in painting mode", "painting", or "erasing" is announced to users on screen readers. Alternatively, this text could be *visually hidden*, but still be read aloud by screen readers. 

* The emoji picker popup implements the [listbox](https://www.w3.org/TR/wai-aria-practices/#Listbox) design pattern and the **keyboard arrow keys can be used to navigate the emoji picker**. Screen readers read aloud the selected emoji. Pressing `Escape` closes the popup and returns focus back the the target `<button>` element. Hitting `Tab` while the emoji picker popup is opened will close the popup and put focus on the next focusable element.

## Styling

The majority of the visual styles for Paint by Emoji uses a functional CSS approach. In this approach small CSS classes are declared and used to compose visual styles.

## Performance

> Would our technical design change if we wanted to implement a 500x500 grid? What would be the performance concerns of a large grid size?

1) **Performance issues with JavaScript startup time**. A 500x500 grid would mean the DOM tree would have at least 250,000 DOM nodes. Google Chrome's Lighthouse Auditing tools [recommends](https://developers.google.com/web/tools/lighthouse/audits/dom-size#recommendations) a DOM tree with less than 1500 DOM nodes. Time to first paint and time to interactive will take long and cause poor user experience. The slowness is caused by scripting while building the DOM tree. I can think of three possible approaches to consider: 

* Server render the initial 500x500 grid and use [`React.hydrate`](https://reactjs.org/docs/react-dom.html#hydrate) to attach JavaScript event handlers to the pre-rendered HTML.

* Limit the user's viewport to seeing a portion of the grid and virtualizing the rest of the (unseen) grid cells using a technique called [windowing](https://reactjs.org/docs/optimizing-performance.html#virtualize-long-lists).

* See if building a grid in HTML Canvas or WebGL would be a worthwhile task to improve rendering and loading performance.

2) **Painting emojis on a 500x500 grid results in a janky experience**. When updating a single grid cell causes the other cells to render. Alternatively, each grid cell can keep track of its own state. So when a user paints on the canvas, we only need to update a single cell's state (as opposed to the entire grid). Because of these implications, _I updated Paint by Emoji to use individual grid state. A more verbose explanation can be found in this_ **[commit message](https://github.com/SlackRecruiting/fe-code-exercise-104563275/commit/2d09f232a2ca8b7bb0bbf964bbfdd78ffb3e235f)**. For comparison of paint performance, try painting on these canvas:
<br/>**Notice slightly slower painting:**  
 [100x80-slow.surge.sh](100x80-slow.surge.sh)  
 [200x200-slow.surge.sh](200x200-slow.surge.sh)  
 [500x500-slow.surge.sh](500x500-slow.surge.sh)<br/>   
**Notice slightly faster painting:**  
[100x80-optimized.surge.sh](100x80-optimized.surge.sh)  
[200x200-optimized.surge.sh](200x200-optimized.surge.sh)  
[500x500-optimized.surge.sh](500x500-optimized.surge.sh)<br/> 
⚠️ _Large grids have a slow load time._
⚠️ _To try Paint by Emoji with higher bounds locally, modify the limits in [/src/constants.js](https://github.com/SlackRecruiting/fe-code-exercise-104563275/blob/h/final/src/constants.js)._

## Open Questions from Slack

> How many emoji do we want to include? Which particular emoji are the most useful in this context?

I included 35 emojis. They include popular emojis and emojis that are commonly used amongst coworkers.

```javascript
[
  ["😀", "😁", "😎", "😘", "😂"], /* smilies */
  ["👎", "👍", "🙏", "💯", "👏"], /* praising an coworker */
  ["💻", "☎️", "📷", "📝", "🔍"],  /* office & work equipment */
  ["🚀", "🎉", "🔥", "💩", "⭐"], /* popular fun emojis */
  ["✈️", "🚆", "🚕", "🚢", "🚌"], /* transportation & travel */
  ["⬆️", "➡️", "⬇️", "⬅️", "♿"],  /* navigation */
  ["⚪", "⚫", "🔴", "🔵", "❓"] /* solid colors */
];
```

> Can we make it easy for the user to set up a `:blank:` emoji in their Slack workspace?

I added a footer with a link referring to Slack's instructions on how to add custom emojis.

> What are useful bounds for the Height and Width fields?

The useful bounds are probably around 20 x 40 because Slack messages have a limit of 4000 characters. A large grid could mean copying shortcodes that combine to a length greater than the character limit for Slack messages.

![4000 Character Limit](https://i.imgur.com/panINm2.png)


If emoji shortnames used are small, like `:mag:` 🔍, then we can have slightly higher bounds. But if emoji shortnames used are long, we might have to consider smaller bounds.

> How should we message those bounds to the user when they're exceeded?

It's common the have error messages appear in red underneath the input. I decided to render the error messages with a warning emoji underneath the input elements when a user types in a invalid bounds. When a user enters a valid bounds however, the error message will go away.

## User Focused Requirements

**Drawing**
* [x] :star: **P1**: As a user, I should be able to select an emoji from a small subset of Emoji 5.
* [x] :star: **P1**: As a user, I should be able to draw that emoji onto the canvas after selecting the Brush tool.
* [x] **P2**: As a user, while using the Brush tool I should be able to click and hold to enter emoji in all the grid squares that my cursor enters.
* [x] :star: **P1**: As a user, I should be able to erase a painted emoji by clicking on it after selecting the Eraser tool.
* [x] **P2**: As a user, while using the Eraser tool I should be able to click and hold to remove emoji in all the grid squares that my cursor enters.
* [x] **P2**: As a user, I should be able to select a new emoji and overwrite an emoji already in a grid square.

**Grid**
* [x] :star: **P1**: As a user, I should be able to adjust the size of the grid by entering numbers into the Height and Width fields.
* [x] **P2**: As a user, I should be notified if I enter invalid data into the Height and Width fields (non-numerical data or numbers out of bounds.
* [x] **P2**: As a user, I should be able to convert the emoji into shortcodes and have them be stored in my clipboard for later pasting (assume the existence of a `:blank:` emoji for the empty cells).
* [x] **P2**: As a user, I should be able to clear the canvas by clicking on the Clear button.

**User experience**
* [x] **P2**: As a user, I shouldn't have to wait more than 1500ms for the page to load.
* [x] **P2**: As a user, the tool should feel responsive to my actions (100ms or less from user action to result on page).
* [x] **P2**: As a user, I should be able to use all of the features of the emoji layout tool in the latest versions of Chrome and Firefox without experiencing bugs.

**Thanks for reading my pull request description! 👊** 

This [ref](https://reactjs.org/docs/hooks-reference.html#useref) will persist throughout the full lifecycle of the component. It passes along a couple of important values that `<EmojiCell>` uses such as `pressed`, `mode`, and `activeEmoji`. 

I am passing these values using a `ref` rather than props to `<EmojiCell>` because I used `React.memo` [here](https://github.com/SlackRecruiting/fe-code-exercise-104563275/pull/1/files#diff-4709e944711535dd8c243c6512f248acR70) prevent parent component state changes to cause rendering of the grid's cells. Rendering grid cells can be expensive for large grids like 500x500.

A `<GridCell>` will not render based on its props. The reason for this is that I used `React.memo` to bail out of renders because renders caused by props was expensive. If the user changed their `activeEmoji` or `mode` state, and we have a 500x500 grid, it would result in a render for 250,000 `<EmojiCell>` components.

Instead, each `<EmojiCell>` is responsible for rendering itself after their initial mounting. They each contain local component state that's updated based on user events (e.g. mouseEnter) and persisted values from the ref (`pressed`, `activeEmoji`, and `mode`).

⚠️ This code is added for demonstration purposes so that large grids can paint slightly faster. 