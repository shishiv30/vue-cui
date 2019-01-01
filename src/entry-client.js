import {
    createApp
} from '@src/app';
import contextClient from '@src/common/mapping/context/client';
import jqext from '@src/common/utilities/jqext';
import initalDirectives from '@src/common/directives';
initalDirectives();
$.extend(jqext);
const {
    app,
    router
} = createApp(window.__INITIAL_STATE__ || contextClient.getContextByWindow());
router.onReady(() => {
    app.$mount('#app');
});
