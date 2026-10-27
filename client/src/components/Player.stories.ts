import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import { computed, ref, watch } from 'vue';
import Player from './Player.vue';
import { playerMock, type PlayerUiModel } from './playerModel';

type PlayerExposed = {
	goTo: (index: number) => void;
	goNext: (force?: boolean) => void;
	goPrev: (force?: boolean) => void;
	play: () => void;
	pause: () => void;
	toggle: () => void;
};

type PlayerStoryArgs = {
	images: string[];
	initialIndex: number;
	showProcess: boolean;
	showControl: boolean;
	autoPlay: boolean;
	animationDuration: number;
	style: 'slide' | 'fly' | 'zoom';
	direction: boolean;
	className: string;
	model?: PlayerUiModel;
	goTo: number;
	goNext: number;
	goPrev: number;
	play: number;
	pause: number;
	toggle: number;
	change?: (index: number) => void;
	changed?: (index: number) => void;
};

const meta = {
	title: 'Components/Player',
	component: Player,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Ken Burns player. Each Controls row is one field of the model. The goTo, goNext, goPrev, play, pause, and toggle controls call those methods. The Events table lists change and changed.',
			},
		},
	},
	argTypes: {
		model: {
			control: false,
			table: { disable: true },
		},
		images: {
			control: 'object',
			description: 'Image URLs. Required. An empty list renders nothing.',
			table: { category: 'props', type: { summary: 'string[]' } },
		},
		initialIndex: {
			control: 'number',
			description: 'Index of the first visible frame (plugin imgIndex).',
			table: { category: 'props', type: { summary: 'number' } },
		},
		showProcess: {
			control: 'boolean',
			description: 'Dot buttons. Shown when omitted.',
			table: { category: 'props', type: { summary: 'boolean' } },
		},
		showControl: {
			control: 'boolean',
			description: 'Prev, toggle, and next buttons. Shown when omitted.',
			table: { category: 'props', type: { summary: 'boolean' } },
		},
		autoPlay: {
			control: 'boolean',
			description: 'If true, start playback after mount.',
			table: { category: 'props', type: { summary: 'boolean' } },
		},
		animationDuration: {
			control: 'number',
			description:
				'Sets --player-animation-duration. Values >= 100 are milliseconds.',
			table: { category: 'props', type: { summary: 'number' } },
		},
		style: {
			control: 'inline-radio',
			options: ['slide', 'fly', 'zoom'],
			description: 'slide is the default. fly moves in to cover. zoom fades and scales in to cover.',
			table: { category: 'props', type: { summary: "'slide' | 'fly' | 'zoom'" } },
		},
		direction: {
			control: 'boolean',
			description: 'Playback direction. true plays forward. false plays the slide in reverse.',
			table: { category: 'props', type: { summary: 'boolean' } },
		},
		className: {
			control: 'text',
			description: 'Extra classes on the root. The root class player stays on the component.',
			table: { category: 'props', type: { summary: 'string' } },
		},
		goTo: {
			control: 'number',
			description:
				'Jump to this index, reset frames, and start playing. Changing the control calls goTo(n).',
			table: { category: 'exposed', type: { summary: '(index: number) => void' } },
		},
		goNext: {
			control: 'number',
			description:
				'Advance one image. Changing the control calls goNext().',
			table: { category: 'exposed', type: { summary: '(force?: boolean) => void' } },
		},
		goPrev: {
			control: 'number',
			description:
				'Return one image. Changing the control calls goPrev().',
			table: { category: 'exposed', type: { summary: '(force?: boolean) => void' } },
		},
		play: {
			control: 'number',
			description:
				'Add class playing. No-op if already playing. Changing the control calls play().',
			table: { category: 'exposed', type: { summary: '() => void' } },
		},
		pause: {
			control: 'number',
			description:
				'Remove class playing. No-op if already paused. Changing the control calls pause().',
			table: { category: 'exposed', type: { summary: '() => void' } },
		},
		toggle: {
			control: 'number',
			description:
				'Toggle between play and pause. Changing the control calls toggle().',
			table: { category: 'exposed', type: { summary: '() => void' } },
		},
		change: {
			description:
				'Fires before the frame updates. The argument is the index being shown.',
			table: { category: 'events', type: { summary: 'index: number' } },
		},
		changed: {
			description:
				'Fires after the frame updates. The argument is the current index.',
			table: { category: 'events', type: { summary: 'index: number' } },
		},
	},
} satisfies Meta<PlayerStoryArgs>;

export default meta;
type Story = StoryObj<PlayerStoryArgs>;

export const Default: Story = {
	args: {
		images: playerMock.images,
		initialIndex: playerMock.initialIndex ?? 0,
		showProcess: playerMock.showProcess ?? true,
		showControl: playerMock.showControl ?? true,
		autoPlay: playerMock.autoPlay ?? false,
		animationDuration: playerMock.animationDuration ?? 4000,
		style: playerMock.style ?? 'slide',
		direction: playerMock.direction ?? true,
		className: playerMock.className ?? '',
		goTo: 0,
		goNext: 0,
		goPrev: 0,
		play: 0,
		pause: 0,
		toggle: 0,
	},
	render: (args) => ({
		components: { Player },
		setup() {
			const player = ref<PlayerExposed | null>(null);
			const model = computed<PlayerUiModel>(() => ({
				images: args.images,
				initialIndex: args.initialIndex,
				showProcess: args.showProcess,
				showControl: args.showControl,
				autoPlay: args.autoPlay,
				animationDuration: args.animationDuration,
				style: args.style,
				direction: args.direction,
				className: args.className,
			}));
			watch(
				() => args.goTo,
				(n) => {
					player.value?.goTo(n);
				},
			);
			watch(
				() => args.goNext,
				() => {
					player.value?.goNext();
				},
			);
			watch(
				() => args.goPrev,
				() => {
					player.value?.goPrev();
				},
			);
			watch(
				() => args.play,
				() => {
					player.value?.play();
				},
			);
			watch(
				() => args.pause,
				() => {
					player.value?.pause();
				},
			);
			watch(
				() => args.toggle,
				() => {
					player.value?.toggle();
				},
			);
			return { player, model };
		},
		template: '<Player ref="player" :model="model" />',
	}),
	play: async ({ canvas, userEvent }) => {
		const toggle = canvas.getByRole('button', { name: 'pause/play' });
		await userEvent.click(toggle);
		await expect(toggle.closest('.player')).toHaveClass('playing');
	},
};
