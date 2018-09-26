import {createApp} from './app'
import contextClient from './common/model/contextClient'
const {app, router, store} = createApp(window.__INITIAL_STATE__ || contextClient)
router.onReady(() => {
    app.$mount('#app')
})
