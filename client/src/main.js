import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import App from './App.vue';

import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

Vue.use(Vuetify, {
    iconfont: 'md'
});
Vue.use(VueRouter);

import routes from './routes';
import vuetify from './plugins/vuetify';

const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');
