import React, { Component } from 'react';

import EmojiPaint from './emoji-paint';

import './app.css';

const EMOJI = [
	'😀',
	'😁',
	'😎',
	'😘',
	'⬆️',
	'➡️',
	'⬇️',
	'⬅️',
	'⚪',
	'⚫',
	'🔴',
	'🔵',
];

const CODES = {
	'😀': ":smile:",
	'😁': ":grin:",
	'😎': ":sunglasses:",
	'😘': ":shocked:",
	'⬆️': ":arrow-up:",
	'➡️': ":arrow-right:",
	'⬇️': ":arrow-down:",
	'⬅️': ":arrow-left:",
	'⚪': ":circle-open:",
	'⚫': ":circle-closed-sm:",
	'🔴': ":circle-closed-lg:",
	'🔵': ":circle-striped:",
	'':":blank:"
}

export default class App extends Component {
	render() {
		return (
			<div className="app">
				<EmojiPaint emoji={EMOJI} codes={CODES}/>
			</div>
		);
	}
}
