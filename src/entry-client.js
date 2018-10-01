import {createApp} from '@src/app'
import contextClient from '@src/common/model/contextClient'
import jqext from '@src/common/utilities/jqext'
import initalDirectives from '@src/common/directives'
initalDirectives();
$.extend(jqext);
const {app, router, store} = createApp(window.__INITIAL_STATE__ || contextClient)
router.onReady(() => {
    app.$mount('#app')
})
