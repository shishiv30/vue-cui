import Vue from 'vue';
import app from './app.vue';
import router from './router';
import stores from './common/stores';
new Vue({
    router,
    stores,
    render: h => h(app)
}).$mount('#app');
