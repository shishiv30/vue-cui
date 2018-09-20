import Vue from 'vue';
import template from './app.vue';
import {createRouter} from './app.router';
import {createStores} from './common/stores';
export function createApp(context) {
    var stores = createStores();
    debugger;
    stores.commit('context/inital', context);
    const router = createRouter();
    const app = new Vue({
        router,
        stores,
        render: h => h(template)
    })
    return {app, router, stores}
}
