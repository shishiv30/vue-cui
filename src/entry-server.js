import {createApp} from './app'
export default function(req) {
    return new Promise((resolve, reject) => {
        const {app, router, store} = createApp()
        router.push('/')
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents.length) {
                return reject({code: 404})
            }
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) {
                    return Component.asyncData({store, route: router.currentRoute})
                }
            })).then(() => {
                resolve(app)
            }).catch(reject)
        }, reject)
    })
}
