import {createApp} from './app'

const data = {
    context: {
        urls: {
            currentUrl: location.href
        }
    }
}
const {app, router, stores} = createApp(data.context)
debugger;
router.onReady(() => {
    app.$mount('#app')
})
