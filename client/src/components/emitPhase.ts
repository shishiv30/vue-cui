import { emit } from '../../js/core/event.js';

/** Same names as `Plugin.emitPhase`: `init.header`, `rendered.slider`, and so on. */
export function emitPhase(phase: string, name: string, el: HTMLElement | null) {
	emit(`${phase}.${name}`, [el]);
}
