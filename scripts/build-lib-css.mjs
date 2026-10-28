import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as sass from 'sass';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist-lib');

const { css } = sass.compile(path.join(root, 'client/scss/index.scss'), { style: 'compressed' });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'style.css'), css.replaceAll('../assets/', './assets/'));
for (const dir of ['fonts', 'img']) {
	fs.cpSync(path.join(root, 'client/assets', dir), path.join(out, 'assets', dir), { recursive: true });
}
fs.rmSync(path.join(out, 'assets/fonts/selection.json'), { force: true });
