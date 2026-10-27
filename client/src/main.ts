import { createWebHistory } from 'vue-router';
import { createApp } from './app';

const { app, router, store } = createApp(createWebHistory());
const stateEl = document.getElementById('__INITIAL_STATE__');
if (stateEl?.textContent) {
	store.replaceState(JSON.parse(stateEl.textContent));
}
router.isReady().then(() => {
	app.mount('#app');
});
