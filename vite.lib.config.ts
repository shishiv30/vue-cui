import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		vue(),
		dts({
			entryRoot: 'client/src',
			include: ['client/src/lib', 'client/src/components/Article.vue', 'client/src/components/Checkbox.vue', 'client/src/components/DropdownCheckbox.vue', 'client/src/components/DropdownRadio.vue', 'client/src/components/GroupDropdown.vue', 'client/src/components/Header.vue', 'client/src/components/Layout.vue', 'client/src/components/Player.vue', 'client/src/components/Radio.vue', 'client/src/components/RangeSlider.vue', 'client/src/components/Select.vue', 'client/src/components/Shifter.vue', 'client/src/components/Slider.vue', 'client/src/components/Textbox.vue', 'client/src/components/ValueSlider.vue'],
			exclude: ['**/*.stories.ts'],
			tsconfigPath: path.resolve(root, 'tsconfig.lib.json'),
		}),
	],
	build: {
		outDir: 'dist-lib',
		emptyOutDir: true,
		cssCodeSplit: false,
		copyPublicDir: false,
		lib: {
			entry: path.resolve(root, 'client/src/lib/index.ts'),
			formats: ['es'],
			fileName: () => 'index.js',
		},
		rollupOptions: {
			external: ['vue'],
		},
	},
});
