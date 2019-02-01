import React, { Component } from 'react';
import EmojiPicker from './emoji-picker';

import './emoji-paint.css';

const DEFAULT_HEIGHT = 8;
const DEFAULT_WIDTH = 10;

export default class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			activeEmoji: props.emoji[0],
			height: DEFAULT_HEIGHT,
			isEmojiPickerShowing: false,
			width: DEFAULT_WIDTH,
		};
	}

	/**
	 * Toggle the visibility of the emoji picker
	 */
	toggleEmojiPicker() {
		this.setState(({ isEmojiPickerShowing }) => ({
			isEmojiPickerShowing: !isEmojiPickerShowing,
		}));
	}

	/**
	 * Set the currently active emoji symbol
	 * @param {String} emoji - the next active emoji
	 */
	updateActiveEmoji(emoji) {
		this.setState(() => ({
			activeEmoji: emoji,
			isEmojiPickerShowing: false,
		}));
	}

	/**
	 * Update the canvas dimensions based on new height and/or width
	 * @param {Object} dimensions - new dimensions
	 * @param {Number} dimensions.height - next height value
	 * @param {Number} dimensions.width - next width value
	 */
	onSizeChange({ height, width }) {
		this.setState(() => ({ height, width }));
	}

	/**
	 * Render the EmojiPaint component
	 * @return {ReactElement} - EmojiPaint element
	 */
	render() {
		return (
			<div className="emoji-paint">
				<div className="emoji-paint__toolbar">
					<div className="emoji-paint__controls">
						<button className="emoji-paint__control" onClick={this.toggleEmojiPicker}>
							{this.state.activeEmoji}
						</button>
						<button className="emoji-paint__control">
							<img className="emoji-paint__control_icon" src="brush.png" alt="brush" />
						</button>
						<button className="emoji-paint__control">
							<img className="emoji-paint__control_icon" src="eraser.png" alt="eraser" />
						</button>
						{this.state.isEmojiPickerShowing && (
							<EmojiPicker
								emoji={this.props.emoji}
								onSelect={(symbol) => this.updateActiveEmoji(symbol)}
								onClose={() => this.toggleEmojiPicker()}
							/>
						)}
					</div>
					<div>
						<label className="emoji-paint__dimension">
							Width
							<input
								type="text"
								className="emoji-paint__dimension_input"
								onChange={(e) => this.onSizeChange({ width: e.target.value })}
								defaultValue={this.state.width}
							/>
						</label>
						<label className="emoji-paint__dimension">
							Height
							<input
								type="text"
								className="emoji-paint__dimension_input"
								onChange={(e) => this.onSizeChange({ height: e.target.value })}
								defaultValue={this.state.height}
							/>
						</label>
					</div>
				</div>
			</div>
		);
	}

}