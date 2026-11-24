import { createSSRApp } from 'vue';
import type { RouterHistory } from 'vue-router';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createPropertyRouter } from './router';
import { usePropertyStore } from './store';
import autocomplete from './directives/autocomplete';
import collapse from './directives/collapse';
import dialog from './directives/dialog';
import lazyload from './directives/lazyload';
import modal from './directives/modal';
import scrollto from './directives/scrollto';
import form from './directives/form';
import tab from './directives/tab';
import theme from './directives/theme';
import tooltip from './directives/tooltip';
import validation from './directives/validation';

export function createApp(history: RouterHistory) {
	const app = createSSRApp(App);
	const pinia = createPinia();
	const router = createPropertyRouter(history);
	app.use(pinia);
	app.use(router);
	const store = usePropertyStore(pinia);
	app.directive('autocomplete', autocomplete);
	app.directive('collapse', collapse);
	app.directive('dialog', dialog);
	app.directive('lazyload', lazyload);
	app.directive('modal', modal);
	app.directive('scrollto', scrollto);
	app.directive('form', form);
	app.directive('tab', tab);
	app.directive('theme', theme);
	app.directive('tooltip', tooltip);
	app.directive('validation', validation);
	return { app, router, store };
}
