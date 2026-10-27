import { createSSRApp } from 'vue';
import type { RouterHistory } from 'vue-router';
import App from './App.vue';
import { createPropertyRouter } from './router';
import { createPropertyStore } from './store';
import collapse from './directives/collapse';
import lazyload from './directives/lazyload';
import form from './directives/form';
import tab from './directives/tab';
import tooltip from './directives/tooltip';
import validation from './directives/validation';
import '../scss/index.scss';

export function createApp(history: RouterHistory) {
	const app = createSSRApp(App);
	const router = createPropertyRouter(history);
	const store = createPropertyStore();
	app.use(router);
	app.use(store);
	app.directive('collapse', collapse);
	app.directive('lazyload', lazyload);
	app.directive('form', form);
	app.directive('tab', tab);
	app.directive('tooltip', tooltip);
	app.directive('validation', validation);
	return { app, router, store };
}
