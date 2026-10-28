// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../../dist');

/**
 * Derive static HTML file path from request path.
 * e.g. "/" -> "index.html", "/page/index" -> "page/index.html"
 * @param {import('express').Request} req
 * @returns {string} Relative path with .html (e.g. "index.html", "page/index.html")
 */
export function getStaticHtmlPath(req) {
	const p = (req.path || '/').replace(/\/$/, '') || '/';
	const relative = p === '/' ? 'index' : p.replace(/^\//, '');
	return relative.endsWith('.html') ? relative : `${relative}.html`;
}

/**
 * Save rendered HTML for static reuse under dist/<path>.
 * @param {string} relativePath - e.g. "index.html", "page/index.html"
 * @param {string} html - Rendered HTML string
 */
export function saveStaticHtml(relativePath, html) {
	const distPath = path.join(DIST_DIR, relativePath);
	const dir = path.dirname(distPath);
	try {
		fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(distPath, html, 'utf8');
	} catch (err) {
		console.error('Failed to save static HTML:', relativePath, err);
	}
}
