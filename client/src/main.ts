import { createWebHistory } from 'vue-router';
import { createApp } from './app';
import { installLinkInterceptor } from './linkInterceptor';
import { initFromStorage, syncToStorage } from './utils/clientData';

const { app, router, store } = createApp(createWebHistory());
const stateEl = document.getElementById('__INITIAL_STATE__');
if (stateEl?.textContent) {
	store.hydrate(JSON.parse(stateEl.textContent));
}
router.isReady().then(async () => {
	await initFromStorage(store);
	installLinkInterceptor(router);
	app.mount('#app');
	syncToStorage(store);
});
