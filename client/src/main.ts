import { createWebHistory } from 'vue-router';
import { createApp } from './app';
import { installLinkInterceptor } from './linkInterceptor';

const { app, router, store } = createApp(createWebHistory());
const stateEl = document.getElementById('__INITIAL_STATE__');
if (stateEl?.textContent) {
	store.replaceState(JSON.parse(stateEl.textContent));
}
router.isReady().then(() => {
	installLinkInterceptor(router);
	app.mount('#app');
});
