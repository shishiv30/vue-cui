import createApp from '@/app';

class AppController {
  constructor () {
    const {app} = createApp(window.context);
    app.$mount('#app');
  }
}

new AppController();
