import type { MapLatLng, MapMarker } from './mapModel';

/** One thing drawn on the map: a single pin (one member) or a group pin (two or more). */
export interface MapGroup {
	/** The marker id for a single pin; `g:` plus the sorted member ids for a group. */
	id: string;
	/** Count-weighted centroid of the members. */
	position: MapLatLng;
	memberIds: string[];
}

/** Groups for every whole zoom level from 0 to `maxZoom`. Build it once per marker change. */
export interface MapMergeTree {
	maxZoom: number;
	/** `levels[z]` is what to draw at zoom `z`. Empty when merging is off. */
	levels: MapGroup[][];
	/** Every marker on its own, drawn above `maxZoom`. */
	singles: MapGroup[];
}

interface Node {
	x: number;
	y: number;
	ids: string[];
}

const TILE = 256;
const MAX_LAT = 85.05112878;

/** Web Mercator, scaled to 0..1 on both axes. */
function project({ lat, lng }: MapLatLng) {
	const sin = Math.sin((Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)) * Math.PI) / 180);
	return {
		x: lng / 360 + 0.5,
		y: 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI),
	};
}

function unproject(x: number, y: number): MapLatLng {
	const n = Math.PI - 2 * Math.PI * y;
	return {
		lat: (180 / Math.PI) * Math.atan(Math.sinh(n)),
		lng: (x - 0.5) * 360,
	};
}

function toGroup(node: Node): MapGroup {
	return {
		id: node.ids.length === 1 ? node.ids[0] : `g:${[...node.ids].sort().join('|')}`,
		position: unproject(node.x, node.y),
		memberIds: node.ids,
	};
}

/** Greedy merge: each node takes every free node within `r` of it (grid cells of size `r`). */
function mergeLevel(nodes: Node[], r: number): Node[] {
	const cells = new Map<string, number[]>();
	const cellOf = (v: number) => Math.floor(v / r);
	nodes.forEach((node, i) => {
		const key = `${cellOf(node.x)}:${cellOf(node.y)}`;
		const list = cells.get(key);
		if (list) {
			list.push(i);
		} else {
			cells.set(key, [i]);
		}
	});
	const used = new Uint8Array(nodes.length);
	const out: Node[] = [];
	nodes.forEach((seed, i) => {
		if (used[i]) {
			return;
		}
		used[i] = 1;
		let weight = seed.ids.length;
		let sx = seed.x * weight;
		let sy = seed.y * weight;
		const ids = [...seed.ids];
		const cx = cellOf(seed.x);
		const cy = cellOf(seed.y);
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				for (const j of cells.get(`${cx + dx}:${cy + dy}`) ?? []) {
					const other = nodes[j];
					if (used[j] || Math.hypot(other.x - seed.x, other.y - seed.y) > r) {
						continue;
					}
					used[j] = 1;
					const w = other.ids.length;
					sx += other.x * w;
					sy += other.y * w;
					weight += w;
					ids.push(...other.ids);
				}
			}
		}
		out.push({ x: sx / weight, y: sy / weight, ids });
	});
	return out;
}

/**
 * Merge pins closer than `radius` screen px, for every zoom from `maxZoom` down to 0.
 * Each level is built from the one above it, so a group always holds whole child groups.
 */
export function buildMergeTree(
	markers: MapMarker[],
	radius: number,
	maxZoom: number,
): MapMergeTree {
	let nodes: Node[] = markers.map((m) => ({ ...project(m.position), ids: [m.id] }));
	const singles = nodes.map(toGroup);
	const levels: MapGroup[][] = [];
	if (radius > 0 && maxZoom >= 0) {
		for (let z = Math.floor(maxZoom); z >= 0; z--) {
			nodes = mergeLevel(nodes, radius / (TILE * 2 ** z));
			levels[z] = nodes.map(toGroup);
		}
	}
	return { maxZoom, levels, singles };
}

/** What to draw at `zoom`: the groups of that whole zoom level, or every pin above `maxZoom`. */
export function groupsAt(tree: MapMergeTree, zoom: number): MapGroup[] {
	const z = Math.max(0, Math.floor(zoom));
	return tree.levels[z] ?? tree.singles;
}
