/**
 * Unit tests for BaseController config/hook behavior.
 * Uses a synthetic config via TestBaseController (getConfig override) so production configs stay unchanged.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import BaseController from '../server/controllers/index.js';

/** @param {Record<string, unknown>} [overrides] */
function createMockReq(overrides = {}) {
	const base = {
		headers: {
			'user-agent': 'Mozilla/5.0 (test)',
			'accept-language': 'en-US,en;q=0.9',
			origin: 'http://localhost:3000',
			...overrides.headers,
		},
		query: { a: '1', b: '2' },
		body: { x: 10, y: 20 },
		path: '/test-contract',
		protocol: 'http',
		get: (/** @type {string} */ h) => (String(h).toLowerCase() === 'host' ? 'localhost:3000' : ''),
		acceptsLanguages: () => ['en-US'],
	};
	return { ...base, ...overrides };
}

function createMockRes() {
	/** @type {{ statusCode?: number, jsonBody?: unknown }} */
	const state = {};
	return {
		state,
		status(code) {
			state.statusCode = code;
			return this;
		},
		json(body) {
			state.jsonBody = body;
		},
	};
}

/**
 * One synthetic config covering all BaseController-recognized hooks and branches.
 * @returns {Record<string, unknown>}
 */
function buildComprehensiveTestConfig() {
	return {
		name: 'test-contract',
		assetName: 'test-assets',
		beforeGet(req, payload) {
			assert.equal(payload.b, '2');
			return { ...payload, fromBeforeGet: true };
		},
		async get(payload) {
			assert.equal(payload.fromBeforeGet, true);
			return {
				meta: {
					title: 'T',
					preload: [{ as: 'image', href: '/page-hero.png' }],
				},
				breadcrumb: { links: [{ text: 'Home', href: '/' }] },
				foo: 'bar',
			};
		},
		beforePost(req, payload) {
			return { ...payload, seenPost: true };
		},
		async post(payload) {
			assert.equal(payload.seenPost, true);
			return { ok: true };
		},
		beforeUpdate(req, payload) {
			return { ...payload, seenUpdate: true };
		},
		async update(payload) {
			assert.equal(payload.seenUpdate, true);
			return { updated: 1 };
		},
		beforeDelete(req, payload) {
			return { ...payload, seenDelete: true };
		},
		async delete(payload) {
			assert.equal(payload.seenDelete, true);
			return { deleted: true };
		},
		preload(req, model) {
			assert.ok(model?.data);
			return [{ as: 'image', href: '/extra.png' }];
		},
		onError(error, payload) {
			return {
				message: `handled:${error.message}`,
				data: { payloadSnapshot: payload },
				code: 418,
			};
		},
	};
}

class TestBaseController extends BaseController {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {ReturnType<typeof buildComprehensiveTestConfig>} mockConfig
	 */
	constructor(req, res, mockConfig) {
		TestBaseController._mockConfig = mockConfig;
		super(req, res, mockConfig.name);
		TestBaseController._mockConfig = undefined;
	}

	getConfig(/** @type {string} */ _name) {
		const m = TestBaseController._mockConfig;
		if (m) return m;
		return super.getConfig(_name);
	}
}

describe('BaseController + route config', () => {
	test('getConfig resolves real route config entries', () => {
		const req = createMockReq();
		const res = createMockRes();
		const bc = new BaseController(req, res, 'geo');
		assert.equal(bc.config.name, 'geo');
		assert.equal(typeof bc.config.get, 'function');
	});

	test('constructor throws when no matching config', () => {
		const req = createMockReq();
		const res = createMockRes();
		assert.throws(
			() => new BaseController(req, res, '__route_that_does_not_exist__'),
			/Model Config is required/,
		);
	});

	test('get uses beforeGet then get; success returns code 200', async () => {
		const cfg = buildComprehensiveTestConfig();
		const c = new TestBaseController(createMockReq(), createMockRes(), cfg);
		const out = await c.get();
		assert.equal(out?.code, 200);
		assert.equal(out?.data?.foo, 'bar');
	});

	test('get error uses onError mapping', async () => {
		const cfg = {
			name: 'err-get',
			beforeGet: () => ({ x: 1 }),
			get: async () => {
				throw new Error('boom');
			},
			onError: (err, payload) => ({
				message: `e:${err.message}`,
				data: payload,
				code: 400,
			}),
		};
		const c = new TestBaseController(createMockReq(), createMockRes(), cfg);
		const out = await c.get();
		assert.equal(out.code, 400);
		assert.equal(out.error, 'e:boom');
		assert.deepEqual(out.data, { x: 1 });
	});

	test('get error without onError falls back to defaults', async () => {
		const cfg = {
			name: 'err-get-raw',
			get: async () => {
				throw new Error('raw');
			},
		};
		const c = new TestBaseController(createMockReq(), createMockRes(), cfg);
		const out = await c.get();
		assert.equal(out.code, 500);
		assert.equal(out.error, 'raw');
		assert.equal(out.data, null);
	});

	test('post/update/delete use before* and return 200 on success', async () => {
		const cfg = buildComprehensiveTestConfig();
		const c = new TestBaseController(createMockReq(), createMockRes(), cfg);
		assert.deepEqual(await c.post(), { code: 200, data: { ok: true } });
		assert.deepEqual(await c.update(), { code: 200, data: { updated: 1 } });
		assert.deepEqual(await c.delete(), { code: 200, data: { deleted: true } });
	});

	test('post without beforePost passes req.body', async () => {
		const cfg = {
			name: 'post-plain',
			post: async (payload) => payload,
		};
		const c = new TestBaseController(createMockReq(), createMockRes(), cfg);
		const out = await c.post();
		assert.equal(out.code, 200);
		assert.equal(out.data.x, 10);
	});

	test('CRUD methods return undefined when handler missing', async () => {
		const cfg = { name: 'minimal', get: async () => ({}) };
		const c = new TestBaseController(createMockReq(), createMockRes(), cfg);
		assert.equal(await c.post(), undefined);
		assert.equal(await c.update(), undefined);
		assert.equal(await c.delete(), undefined);
	});

	test('toData injects meta and sends JSON envelope', async () => {
		const cfg = buildComprehensiveTestConfig();
		const res = createMockRes();
		const c = new TestBaseController(createMockReq(), res, cfg);
		const model = {
			code: 201,
			data: { hello: 1 },
			error: null,
		};
		await c.toData(model);
		assert.equal(res.state.statusCode, 201);
		assert.equal(res.state.jsonBody.code, 201);
		assert.equal(res.state.jsonBody.data.hello, 1);
		assert.ok(res.state.jsonBody.data.meta);
		assert.equal(res.state.jsonBody.data.meta.role, 'test-assets');
		assert.ok(Array.isArray(res.state.jsonBody.data.meta.preload));
		assert.ok(res.state.jsonBody.cost >= 0);
	});

	test('initialMeta uses model.data.meta.preload and appends config.preload', async () => {
		const cfg = buildComprehensiveTestConfig();
		const c = new TestBaseController(createMockReq(), createMockRes(), cfg);
		const model = {
			data: {
				meta: {
					preload: [{ as: 'font', href: '/f.woff2' }],
				},
			},
		};
		const meta = c.initialMeta(model);
		const hrefs = meta.preload.map((p) => p.href);
		assert.ok(hrefs.some((h) => String(h).includes('f.woff2')));
		assert.ok(hrefs.some((h) => String(h).includes('extra.png')));
	});
});
