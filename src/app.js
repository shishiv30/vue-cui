import Vue from 'vue';
import template from './app.vue';
import {
    createRouter
} from './app.router';
import {
    createStores
} from './common/store';
import {
    sync
} from 'vuex-router-sync';
export function createApp (context) {
    var store = createStores(context);
    const router = createRouter();
    sync(store, router);
    const app = new Vue({
        router,
        store,
        render: h => h(template)
    });
    return {
        app,
        router,
        store
    };
}
