import express from 'express';
import compression from 'compression';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { ViteDevServer } from 'vite';
import swaggerUi from 'swagger-ui-express';
import config from './config.js';
import session from './middleware/session.js';
import geo from './middleware/geo.js';
import router from './routes/index.js';
import swaggerSpec from './swaggerConfig.js';
import { runWithSoaLogs } from './controllers/realestate.js';
import {
	loadPropertySearchPageState,
	loadPropertySitemapPageState,
} from './utils/propertyPageState.js';
import { matchPropertySpaRoute } from '../helpers/routes/propertySpaRoutes.js';

type ListingPreloadState = {
	kind?: string;
	articles?: { img?: string }[];
	detail?: { album?: { images?: string[] } | null } | null;
};

function listingPreload(url: string, state: ListingPreloadState) {
	const id = matchPropertySpaRoute(url)?.id;
	if (id === 'detail') {
		return state.detail?.album?.images?.[0] || '';
	}
	if (id === 'geo' || id === 'map') {
		return state.articles?.[0]?.img || '';
	}
	return '';
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isProd = config.mode === 'production' || config.mode === 'stage';

const app = express();
app.set('views', path.join(__dirname, 'ejs'));
app.set('view engine', 'ejs');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(compression());
session(app);
app.use(cors({ origin: config.corsOrigins }));
app.use((req, res, next) => {
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
	res.append('Link', '</llms.txt>; rel="describedby"');
	next();
});
app.use((_req, _res, next) => {
	runWithSoaLogs(() => next());
});

let vite: ViteDevServer | null = null;

if (!isProd) {
	const { createServer } = await import('vite');
	vite = await createServer({
		root,
		server: { middlewareMode: true },
		appType: 'custom',
	});
	app.use((req, res, next) => {
		const pagePath = req.path;
		const handledByApp = pagePath === '/'
			|| pagePath === '/property'
			|| pagePath.startsWith('/property/')
			|| pagePath === '/document'
			|| pagePath === '/document.html'
			|| pagePath.startsWith('/api')
			|| pagePath === '/llms.txt';
		if (handledByApp) {
			next();
			return;
		}
		vite?.middlewares(req, res, next);
	});
} else {
	app.use(express.static(path.join(root, 'dist'), { redirect: false }));
}

app.get('/document.html', (_req, res) => {
	res.redirect(301, '/document');
});

app.use(async (req, res, next) => {
	const pagePath = req.path.replace(/\/+$/, '') || '/';
	const isDocument = pagePath === '/' || pagePath === '/document';
	const propertyPage = pagePath === '/property' || pagePath.startsWith('/property/sitemap')
		? await loadPropertySitemapPageState(req)
		: pagePath.startsWith('/property')
			? await loadPropertySearchPageState(req)
			: null;
	if (!isDocument && !propertyPage) {
		next();
		return;
	}
	if (propertyPage && propertyPage.action === 'redirect') {
		res.redirect(301, '/property/sitemap');
		return;
	}
	try {
		const url = req.path;
		const templatePath = path.join(root, 'client/src/index.html');
		let template = fs.readFileSync(templatePath, 'utf8');
		let render: (
			pageUrl: string,
			pageState?: unknown,
		) => Promise<{ html: string; state: unknown }>;
		if (!isProd && vite) {
			template = await vite.transformIndexHtml(url, template);
			template = template.replaceAll('/index.min.css', '/client/scss/index.scss');
			render = (await vite.ssrLoadModule('/client/src/entry-server.ts')).render as typeof render;
		} else {
			const serverEntry = pathToFileURL(path.join(root, 'dist/server/entry-server.js')).href;
			render = (await import(serverEntry)).render;
			template = template.replace(
				'/client/src/main.ts',
				'/property.min.js',
			);
		}
		const pageState = propertyPage && propertyPage.action === 'page'
			? propertyPage.state as { title?: string }
			: undefined;
		const title = pageState?.title
			|| (isDocument ? 'Document' : 'Property');
		template = template.replace('<title>Property</title>', `<title>${title}</title>`);
		const rendered = await render(url, pageState);
		const preloadImage = listingPreload(url, rendered.state as ListingPreloadState);
		if (preloadImage) {
			const href = preloadImage.replace(/"/g, '%22');
			template = template.replace(
				'</head>',
				`\t<link rel="preload" href="${href}" as="image" />\n</head>`,
			);
		}
		const page = template
			.replace('<!--app-html-->', rendered.html)
			.replace(
				'<!--app-state-->',
				JSON.stringify(rendered.state).replace(/</g, '\\u003c'),
			);
		res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error));
		vite?.ssrFixStacktrace(err);
		next(err);
	}
});

app.use('/', router);

await geo(app);
app.listen(config.port, () => {
	console.log(`App listening on ${config.appHost}`);
	console.log(`API docs at ${config.appHost}/api-docs`);
	console.log(`Property page at ${config.appHost}/property`);
	console.log(`Document page at ${config.appHost}/`);
});
