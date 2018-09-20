import context from './context';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStores() {
    return new Vuex.Store({
        modules:{
            context
        }
    });
}
