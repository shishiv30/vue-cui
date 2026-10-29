/**
 * Prefixes a root-relative asset path with the Vite base, so `/images/01.jpg` still resolves
 * when the app is served from a sub-path such as `/vue-cui/` (the published Storybook).
 * Absolute URLs pass through untouched.
 */
export function assetUrl(path: string): string {
	if (!path.startsWith('/') || path.startsWith('//')) {
		return path;
	}
	const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/';
	return `${base.replace(/\/$/, '')}${path}`;
}
