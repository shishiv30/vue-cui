import context from './context';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStores(ctx) {
    Object.assign(context.state, ctx);
    return new Vuex.Store({
        modules: {
            context: context
        }
    });
}
