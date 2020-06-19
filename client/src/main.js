import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import App from './App.vue';

import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import 'vuetify/dist/vuetify.min.css';
import store from '@/store/store';
import Notifications from 'vue-notification';

Vue.use(Notifications);
Vue.config.productionTip = false;

Vue.use(Vuetify, {
    iconfont: 'md'
});
Vue.use(VueRouter);

import { router } from './router';
import vuetify from './plugins/vuetify';

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
