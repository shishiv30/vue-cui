import context from './context';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default () => {
    return new Vuex.Store({
        modules:{
            context
        }
    });
}
