import localforage from 'localforage';

/**
 * Client-side persistent storage (IndexedDB, falls back to localStorage) via localForage.
 * Safe on the server and when storage is blocked: reads return null, writes do nothing.
 */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type Entry<T> = { value: T; savedAt: number };

const hasWindow = typeof window !== 'undefined';
const db = hasWindow ? localforage.createInstance({ name: 'vue-cui', storeName: 'cache' }) : null;

export async function getStored<T>(key: string, maxAgeMs = MAX_AGE_MS): Promise<T | null> {
	if (!db) {
		return null;
	}
	try {
		const entry = await db.getItem<Entry<T>>(key);
		if (!entry || Date.now() - entry.savedAt > maxAgeMs) {
			return null;
		}
		return entry.value;
	} catch {
		return null;
	}
}

export async function setStored<T>(key: string, value: T): Promise<void> {
	if (!db) {
		return;
	}
	try {
		await db.setItem<Entry<T>>(key, { value, savedAt: Date.now() });
	} catch {
		// storage blocked or full: the cache is optional
	}
}
