import { expect } from 'storybook/test';

export async function expectClassWhenSet(el: Element, token: string) {
	if (token) {
		await expect(el).toHaveClass(token);
	}
}

export async function expectClassAbsent(el: Element, token: string) {
	await expect(el).not.toHaveClass(token);
}
