/// <reference types="vitest/config" />
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { renderEjsClientModule } from './helpers/ejs-client-loader.js';
import { pageConfig } from './client/pages.config.js';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const root = path.dirname(fileURLToPath(import.meta.url));
function includeHtml() {
	return {
		name: 'html-include',
		transformIndexHtml(html: string) {
			let next = html.replace(/<!--\s*include:([^>]+?)\s*-->/g, (_match, includePath: string) => {
				const fullPath = path.resolve(root, 'client/components', includePath.trim());
				try {
					return fs.readFileSync(fullPath, 'utf8');
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					console.warn(`Could not include ${includePath}: ${message}`);
					return _match;
				}
			});
			if (!next.includes('rel="describedby"')) {
				next = next.replace(/<head[^>]*>/i, '$&\n<link rel="describedby" href="/llms.txt">');
			}
			if (!next.includes('type="module"') && !next.includes('<!--app-html-->')) {
				next = next.replace(/<\/body>/i, '<script type="module" src="./index.js"></script>\n</body>');
			}
			return next;
		}
	};
}
function ejsClient() {
	return {
		name: 'ejs-client',
		transform(_code: string, id: string) {
			if (!id.endsWith('.ejs') || !id.includes(`${path.sep}server${path.sep}ejs${path.sep}`)) {
				return null;
			}
			return {
				code: renderEjsClientModule(id.split('?')[0]),
				map: null
			};
		}
	};
}
/** Dev only: sw.js imports workbox (not installed), so serve a stub that clears any stale registration. */
function devSwStub() {
	return {
		name: 'dev-sw-stub',
		apply: 'serve' as const,
		configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: { setHeader: (k: string, v: string) => void; end: (body: string) => void }, next: () => void) => void) => void } }) {
			server.middlewares.use((req, res, next) => {
				if (req.url?.split('?')[0] !== '/sw.js') {
					return next();
				}
				res.setHeader('Content-Type', 'text/javascript');
				res.end("self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',()=>self.registration.unregister());");
			});
		}
	};
}
/** Dev only: build copies client/assets/images to dist/images, so serve the same folder at /images. */
function devImages() {
	const dir = path.resolve(root, 'client/assets/images');
	return {
		name: 'dev-images',
		apply: 'serve' as const,
		configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: { setHeader: (k: string, v: string) => void; end: (body: Buffer) => void }, next: () => void) => void) => void } }) {
			server.middlewares.use((req, res, next) => {
				const url = req.url?.split('?')[0] ?? '';
				if (!url.startsWith('/images/')) {
					return next();
				}
				const file = path.join(dir, decodeURIComponent(url.slice('/images/'.length)));
				if (!file.startsWith(dir + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
					return next();
				}
				const types: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
				res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] ?? 'application/octet-stream');
				res.end(fs.readFileSync(file));
			});
		}
	};
}
function copyStatic() {
	return {
		name: 'copy-static',
		closeBundle() {
			const dist = path.resolve(root, 'dist');
			fs.mkdirSync(dist, {
				recursive: true
			});
			fs.copyFileSync(path.resolve(root, 'llms.txt'), path.join(dist, 'llms.txt'));
			const imagesFrom = path.resolve(root, 'client/assets/images');
			if (fs.existsSync(imagesFrom)) {
				fs.cpSync(imagesFrom, path.join(dist, 'images'), {
					recursive: true
				});
			}
			const sw = path.resolve(root, 'sw.js');
			if (fs.existsSync(sw)) {
				fs.copyFileSync(sw, path.join(dist, 'sw.js'));
			}
			fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), JSON.stringify({
				name: 'CUI pure framework',
				short_name: 'CUI pure framework',
				description: 'UI solution base on pure js and css.',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				start_url: '/document',
				icons: []
			}, null, 2));
		}
	};
}
const mpaInput = Object.fromEntries(pageConfig.pages.map(page => [page.name, path.resolve(root, `client/pages/${page.name}/index.html`)]));
export default defineConfig({
	define: {
		__APP_BASE__: JSON.stringify('')
	},
	plugins: [vue(), includeHtml(), ejsClient(), devSwStub(), devImages(), copyStatic()],
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		cssCodeSplit: false,
		rollupOptions: {
			input: {
				...mpaInput,
				property: path.resolve(root, 'client/src/main.ts')
			},
			output: {
				entryFileNames: '[name].min.js',
				chunkFileNames: '[name].min.js',
				assetFileNames: assetInfo => {
					const name = assetInfo.names?.[0] || assetInfo.name || '';
					if (name.endsWith('.css')) {
						return 'index.min.css';
					}
					if (/\.(woff2?|ttf|eot)$/i.test(name)) {
						return 'font.[name][extname]';
					}
					if (/\.(svg|png|jpe?g|gif|ico|webp)$/i.test(name)) {
						return 'images/[name][extname]';
					}
					return 'assets/[name][extname]';
				}
			}
		}
	},
	server: {
		port: 3001,
		host: 'localhost',
		proxy: {
			'/api': 'http://localhost:3000',
			'/property': 'http://localhost:3000',
			'/document': 'http://localhost:3000',
			'/llms.txt': 'http://localhost:3000'
		}
	},
	test: {
		projects: [{
			extends: true,
			plugins: [
				storybookTest({
					configDir: path.join(root, '.storybook'),
					...(process.env.SB_URL ? { storybookUrl: process.env.SB_URL } : {}),
				}),
			],
			test: {
				name: 'storybook',
				browser: {
					enabled: true,
					headless: true,
					provider: playwright({}),
					instances: [{
						browser: 'chromium',
					}],
				},
			},
		}],
	},
});