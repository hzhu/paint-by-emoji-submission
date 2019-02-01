import React from 'react';
import { shallow } from 'enzyme';
import EmojiPicker from './emoji-picker';

describe('EmojiPicker', () => {

	it('renders without throwing', () => {
		shallow(<EmojiPicker />);
	});

	it('triggers "onClose" when shadow is clicked', () => {
		const onClose = jest.fn();
		const emojiPicker = shallow(<EmojiPicker onClose={onClose} />);
		emojiPicker.find('.emoji-picker__shadow').simulate('click');
		expect(onClose).toBeCalled();
	});

	it('triggers "onSelect" when emoji is clicked', () => {
		const onSelect = jest.fn();
		const emojiPicker = shallow(<EmojiPicker onSelect={onSelect} emoji={['foo']} />);
		emojiPicker.find('.emoji-picker__control').simulate('click');
		expect(onSelect).toBeCalledWith('foo');
	});

});
