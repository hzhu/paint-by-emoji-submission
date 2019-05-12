import React, { Component } from "react";

import EmojiPaint from "./emoji-paint";

import "./app.css";

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <EmojiPaint />
      </div>
    );
  }
}
