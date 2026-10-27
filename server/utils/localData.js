/**
 * Load page and comp modules from data/.
 */

/** Safe key for dynamic import: only [a-zA-Z0-9_-] to avoid path traversal */
function safeKey(key) {
	if (typeof key !== 'string') return '';
	return key.replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Load page data by key from data/page/{key}.js
 * @param {string} key - Page key (e.g. 'index', 'ai-trend')
 * @returns {Promise<{ data: object, meta: object|null }|null>}
 */
export async function getPageData(key) {
	const safe = safeKey(key);
	if (!safe) {
		console.error('Invalid page key:', key);
		return null;
	}
	try {
		const dataModule = await import(`../../data/page/${safe}.js`);
		return { data: dataModule.default, meta: dataModule.meta || null };
	} catch (err) {
		console.error('Failed to load local page data:', safe, err);
		return null;
	}
}

/**
 * Load comps from data/comps/{key}.js
 * @param {string[]} [keys=['header', 'footer']]
 * @returns {Promise<Record<string, unknown>>}
 */
export async function getComps(keys) {
	const requested = Array.isArray(keys) && keys.length ? keys : ['header', 'footer'];
	const result = {};

	for (const key of requested) {
		result[key] = await getCompByKey(key);
	}

	return result;
}

/**
 * Load one comp from data/comps/{key}.js
 * @param {string} key - Comp key (e.g. 'theme', 'header')
 * @returns {Promise<object|null>}
 */
export async function getCompByKey(key) {
	const safe = safeKey(key);
	if (!safe) return null;
	try {
		const m = await import(`../../data/comps/${safe}.js`);
		return m.default ?? null;
	} catch (err) {
		console.error('Failed to load local comp:', key, err);
		return null;
	}
}
