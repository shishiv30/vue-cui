import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

test('vue ssr property sitemap renders groups heading', async () => {
	const vite = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
	});
	try {
		const mod = await vite.ssrLoadModule('/client/src/entry-server.ts');
		const rendered = await mod.render('/property/sitemap');
		assert.match(rendered.html, /<h1 class="f3 text-bold text-center">Property<\/h1>/);
		assert.equal(rendered.state.marker, 'vue-property');
	} finally {
		await vite.close();
	}
});

test('vue ssr property search renders listing page', async () => {
	const vite = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
	});
	try {
		const mod = await vite.ssrLoadModule('/client/src/entry-server.ts');
		const rendered = await mod.render('/property/tx');
		assert.match(rendered.html, /page-property/);
		assert.match(rendered.html, /aria-label="Listing"/);
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
