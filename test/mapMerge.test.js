import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMergeTree, groupsAt } from '../client/src/components/mapMerge.ts';

// About 20 m apart: one spot at zoom 14, apart above zoom 16.
const near = [
	{ id: 'a', position: { lat: 30.2672, lng: -97.7431 } },
	{ id: 'b', position: { lat: 30.2674, lng: -97.7429 } },
];
const far = { id: 'z', position: { lat: 30.4, lng: -97.6 } };

describe('mapMerge', () => {
	test('pins within the radius merge, far pins stay single', () => {
		const tree = buildMergeTree([...near, far], 48, 16);
		const items = groupsAt(tree, 14);
		assert.equal(items.length, 2);
		const group = items.find((i) => i.memberIds.length === 2);
		assert.deepEqual([...group.memberIds].sort(), ['a', 'b']);
		assert.equal(group.id, 'g:a|b');
		assert.ok(items.some((i) => i.id === 'z'));
	});

	test('no merging above maxZoom, or when the radius is 0', () => {
		const tree = buildMergeTree(near, 48, 16);
		assert.equal(groupsAt(tree, 17).length, 2);
		assert.equal(groupsAt(tree, 16.9).length, 1);
		assert.equal(groupsAt(buildMergeTree(near, 0, 16), 3).length, 2);
	});

	test('everything merges at zoom 0', () => {
		const tree = buildMergeTree([...near, far], 48, 16);
		assert.equal(groupsAt(tree, 0).length, 1);
		assert.equal(groupsAt(tree, -2).length, 1);
	});

	test('a group always holds whole groups of the level above', () => {
		const markers = Array.from({ length: 60 }, (_, i) => ({
			id: `m${i}`,
			position: { lat: 30 + ((i * 37) % 100) / 200, lng: -97 - ((i * 53) % 100) / 200 },
		}));
		const tree = buildMergeTree(markers, 48, 16);
		for (let z = 1; z <= 16; z++) {
			const parents = new Map();
			for (const g of groupsAt(tree, z - 1)) {
				for (const id of g.memberIds) {
					parents.set(id, g.id);
				}
			}
			for (const child of groupsAt(tree, z)) {
				const owners = new Set(child.memberIds.map((id) => parents.get(id)));
				assert.equal(owners.size, 1, `zoom ${z} child ${child.id}`);
			}
			const count = groupsAt(tree, z).reduce((n, g) => n + g.memberIds.length, 0);
			assert.equal(count, markers.length);
		}
	});

	test('the group sits at the centroid of its members', () => {
		const pts = [
			{ id: 'a', position: { lat: 10, lng: 10 } },
			{ id: 'b', position: { lat: 10, lng: 10.0002 } },
		];
		const [group] = groupsAt(buildMergeTree(pts, 48, 16), 10);
		assert.ok(Math.abs(group.position.lng - 10.0001) < 1e-9);
		assert.ok(Math.abs(group.position.lat - 10) < 1e-9);
	});
});
