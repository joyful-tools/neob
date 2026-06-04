import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { action } from 'storybook/actions';

import { TypeWords } from './type-words';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * TypeWords mimics typewriter animation character-by-character.
 */
const meta = {
	title: 'Experiments/TypeWords',
	component: TypeWords,
	parameters: {
		layout: 'row',
	},
	args: {
		text: '',
	},
} satisfies Meta<typeof TypeWords>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const initialText = 'Lorem ipsum dolor sit amet';
		const expandedText =
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

		const [text, setText] = useState(initialText);
		const [textDone, setTextDone] = useState(false);
		const [typeWordsDone, setTypeWordsDone] = useState(false);

		// Trigger expanded text after 3 seconds matching Svelte playground
		useEffect(() => {
			const timer = setTimeout(() => {
				setText(expandedText);
				setTextDone(true);
			}, 3000);

			return () => clearTimeout(timer);
		}, []);

		return (
			<div className="flex max-w-lg flex-col gap-6 p-6">
				<div className="flex items-baseline gap-1">
					<TypeWords
						text={text}
						speed={12}
						onglyph={() => action('glyph')()}
						onstart={() => setTypeWordsDone(false)}
						onfinish={() => setTypeWordsDone(true)}
					/>

					{/* Simple dot-dot-dot typing indicator when waiting for more text */}
					<AnimatePresence>
						{!textDone && typeWordsDone && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.75 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="inline-block text-black dark:text-white"
							>
								<span className="animate-typing-indicator" style={{ animationDelay: '100ms' }}>
									.
								</span>
								<span className="animate-typing-indicator" style={{ animationDelay: '200ms' }}>
									.
								</span>
								<span className="animate-typing-indicator" style={{ animationDelay: '300ms' }}>
									.
								</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
	},
};
