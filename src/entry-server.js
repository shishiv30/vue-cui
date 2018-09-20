import { createApp } from './app'
export default function(data) {
  return new Promise((resolve, reject) => {
    const { app, router, stores } = createApp(data.context)
    router.push(stores.urls.currentUrl)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      resolve(app)
    }, reject)
  })
}
