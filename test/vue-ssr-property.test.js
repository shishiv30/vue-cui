import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

test('vue ssr property renders the vuex marker', async () => {
	const vite = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
	});
	try {
		const mod = await vite.ssrLoadModule('/client/src/entry-server.ts');
		const rendered = await mod.render('/property');
		assert.match(rendered.html, /data-property-marker="vue-property"/);
		assert.equal(rendered.state.marker, 'vue-property');
	} finally {
		await vite.close();
	}
});

test('vue ssr home renders the document marker', async () => {
	const vite = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
	});
	try {
		const mod = await vite.ssrLoadModule('/client/src/entry-server.ts');
		const rendered = await mod.render('/');
		assert.match(rendered.html, /data-document-marker="vue-document"/);
	} finally {
		await vite.close();
	}
});

test('vue ssr document renders the document marker', async () => {
	const vite = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
	});
	try {
		const mod = await vite.ssrLoadModule('/client/src/entry-server.ts');
		const rendered = await mod.render('/document');
		assert.match(rendered.html, /data-document-marker="vue-document"/);
		assert.match(rendered.html, /id="welcome"/);
	} finally {
		await vite.close();
	}
});
