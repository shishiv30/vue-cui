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
			include: [
				'client/src/lib',
				'client/src/components/Article.vue',
				'client/src/components/articleModel.ts',
				'client/src/components/assetUrl.ts',
				'client/src/components/Checkbox.vue',
				'client/src/components/DropdownCheckbox.vue',
				'client/src/components/DropdownRadio.vue',
				'client/src/components/formEnumOption.ts',
				'client/src/components/GroupDropdown.vue',
				'client/src/components/groupdropdownModel.ts',
				'client/src/components/Header.vue',
				'client/src/components/headerModel.ts',
				'client/src/components/Layout.vue',
				'client/src/components/layoutModel.ts',
				'client/src/components/Map.vue',
				'client/src/components/mapAustinEncoded.ts',
				'client/src/components/mapModel.ts',
				'client/src/components/mapMerge.ts',
				'client/src/components/mapStyles.ts',
				'client/src/components/Player.vue',
				'client/src/components/playerModel.ts',
				'client/src/components/Radio.vue',
				'client/src/components/RangeSlider.vue',
				'client/src/components/Select.vue',
				'client/src/components/Sharelink.vue',
				'client/src/components/sharelinkModel.ts',
				'client/src/components/Shifter.vue',
				'client/src/components/shifterModel.ts',
				'client/src/components/Slider.vue',
				'client/src/components/sliderModel.ts',
				'client/src/components/sliderScale.ts',
				'client/src/components/Textbox.vue',
				'client/src/components/ValueSlider.vue',
				'client/src/components/Welcome.vue',
				'client/src/components/welcomeModel.ts',
				'client/src/directives/autocomplete.ts',
				'client/src/directives/collapse.ts',
				'client/src/directives/dialog.ts',
				'client/src/directives/lazyload.ts',
				'client/src/directives/modal.ts',
				'client/src/directives/scrollto.ts',
				'client/src/directives/tab.ts',
				'client/src/directives/theme.ts',
				'client/src/directives/tooltip.ts',
				'client/src/env.d.ts',
			],
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
			external: ['vue', 'qrcode-generator'],
		},
	},
});
