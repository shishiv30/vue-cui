import Vue from 'vue';
import {createApp } from './app';
import jqext from './common/utilities/jqext';
import contextClient from '@/common/mapping/context/client';
import initalDirectives from './common/directives';


Vue.mixin({
    beforeRouteUpdate (to, from, next) {
        const { asyncData } = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next);
        } else {
            next();
        }
    }
});

initalDirectives();
$.extend(jqext);

const {app, router, store} = createApp();

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}else{
    store.replaceState = contextClient.getContextByWindow();
}

router.onReady(() => {
    router.beforeResolve((to,from,next)=>{
       
    });
    app.$mount('#app');
});