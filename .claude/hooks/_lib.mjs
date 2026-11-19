/** Shared helpers for the hook scripts in this folder (Claude Code and Cursor). */
import fs from 'fs';

/** Parse the hook's JSON from stdin; {} when there is none or it is invalid. */
export function readInput() {
	try {
		return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
	} catch {
		return {};
	}
}

/** The Bash command (Claude: tool_input.command; Cursor: command). */
export const command = (input) => String(input.tool_input?.command ?? input.command ?? '');

/** The edited file path (Edit / Write tools). */
export const filePath = (input) => String(input.tool_input?.file_path ?? '');

/** Send extra context back to the model, in Claude or Cursor format. */
export function addContext(event, text, mode = 'claude') {
	const out =
		mode === 'cursor'
			? { additional_context: text }
			: { hookSpecificOutput: { hookEventName: event, additionalContext: text } };
	process.stdout.write(JSON.stringify(out));
}
