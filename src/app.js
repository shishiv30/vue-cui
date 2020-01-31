import Vue from 'vue';
import App from './app.vue';
import { createRouter} from './app.router';
import {createStores} from './common/store';
import { sync } from 'vuex-router-sync';
export function createApp() {
    var store = createStores();
    const router = createRouter();
    sync(store, router);
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });
    return { app, router, store};
}
