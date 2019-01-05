import {
    createApp
} from '@/app';
import contextClient from '@/common/mapping/context/client';
import jqext from '@/common/utilities/jqext';
import initalDirectives from '@/common/directives';
initalDirectives();
$.extend(jqext);
const {
    app,
    router
} = createApp(window.__INITIAL_STATE__ || contextClient.getContextByWindow());
router.onReady(() => {
    app.$mount('#app');
});