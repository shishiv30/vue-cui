
import {createApp} from './app'
const {app, router, store} = createApp(window.__INITIAL_STATE__ || {})
router.onReady(() => {
    app.$mount('#app')
})
