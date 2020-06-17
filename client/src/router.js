import Vue from 'vue';
import Router from 'vue-router';

import AdminBoard from './components/AdminBoard.vue';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import Signup from './components/Signup.vue';
import User from './components/User.vue';
import store from '@/store/store';
Vue.use(Router);

const checkAuthentication = (to, from, next) => {
    if (store.state.token) {
        return next();
    }
};
export const router = new Router({
    mode: 'history',

    routes: [
        { path: '/', component: Login },
        { path: '/login', component: Login },
        { path: '/home', component: Home },
        { path: '/signup', component: Signup },
        { path: '/user', component: User, beforeEnter: checkAuthentication },
        { path: '/admin', component: AdminBoard },
        { path: '*', redirect: '/' }
    ]
});
