import type { PageLink } from '../store';
import { usePropertyStore } from '../store';
import { getStored, setStored } from './storage';

/** Data kept in browser storage. To add one: a key, a store field, one entry in `ITEMS`. */
const GEO_STATES_KEY = 'geo:states';

type Store = ReturnType<typeof usePropertyStore>;

const ITEMS = [
	{
		key: GEO_STATES_KEY,
		url: '/api/geo/states',
		pick: (json: { states?: PageLink[] }) => json.states ?? null,
		apply: (store: Store, value: PageLink[]) => {
			store.states = value;
		},
		has: (store: Store) => store.states.length > 0,
	},
];

/** Before mount: fill the store from storage. */
export async function initFromStorage(store: Store) {
	await Promise.all(
		ITEMS.map(async (item) => {
			const value = await getStored<never>(item.key);
			if (value) {
				item.apply(store, value);
			}
		}),
	);
}

/** After load: fetch what is missing from storage (or stale) and save it. */
export function syncToStorage(store: Store) {
	ITEMS.forEach(async (item) => {
		if (item.has(store)) {
			return;
		}
		try {
			const response = await fetch(item.url);
			if (!response.ok) {
				return;
			}
			const value = item.pick(await response.json());
			if (value) {
				item.apply(store, value as never);
				await setStored(item.key, value);
			}
		} catch {
			// offline: try again next load
		}
	});
}
