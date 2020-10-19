import Vue from 'vue';
import Router from 'vue-router';

import Login from './components/Login.vue';
import Home from './components/Home.vue';
import User from './components/User.vue';
import store from '@/store/modules/auth';

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
        { path: '/user', component: User, beforeEnter: checkAuthentication },
        {
            path: '/admin',
            component: () => import('./components/AdminBoard'),
            beforeEnter: checkAuthentication
        },
        {
            path: '/users/:userId',
            component: () => import('./components/UserBoard'),
            beforeEnter: checkAuthentication
        },
        {
            path: '/contracts/:userId',
            component: () => import('./components/AdminContracts'),
            beforeEnter: checkAuthentication
        },

        {
            path: '/leaves/:userId',
            component: () => import('./components/AdminLeave'),
            beforeEnter: checkAuthentication
        },

        { path: '*', redirect: '/' }
    ]
});
