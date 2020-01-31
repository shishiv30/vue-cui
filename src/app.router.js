import Vue from 'vue';
import Router from 'vue-router';
import doc from './doc/doc.vue';
Vue.use(Router);
export function createRouter () {
    return new Router({
        mode: 'history',
        routes: [{
            path: '*',
            name: 'doc',
            component: doc
        }]
    });
};

// import Vue from 'vue';
// import Router from 'vue-router';
// Vue.use(Router);
// export function createRouter () {
//     return new Router({
//         mode: 'history',
//         routes: [{
//             path: '/todo',
//             component: function(){
//                 return import(/* webpackChunkName: "todo" */ '@/todo/todo.vue');
//             } 
//         },{
//             path: '*',
//             component: function(){
//                 return import(/* webpackChunkName: "doc" */ '@/doc/doc.vue');
//             } 
//         }]
//     });
// };
