import Vue from 'vue';
import Vuex from 'vuex';
// import AuthService from '@/services/AuthService';
import { router } from '../router';
Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    state: {
        token: null,
        user: null,
        roles: []
    },
    getters: {
        isAuthenticated(state) {
            return state.token !== null;
        },
        isAdmin(state) {
            return state.roles.find(r => r.name === 'admin');
        },
        getUser(state) {
            return state.user;
        },
        getRoles(state) {
            return state.roles;
        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        setUser(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        setRoles(state, roles) {
            state.roles = roles;
            localStorage.setItem('roles', JSON.stringify(roles));
        },
        clearAuthData(state) {
            state.token = null;
            state.user = null;
            state.roles = [];
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('roles');
        }
    },

    actions: {
        async login({ commit, dispatch }, data) {
            try {
                const now = new Date();
                const expirationDate = new Date(now.getTime() + 600 * 1000); //take from backend

                localStorage.setItem('expirationDate', expirationDate);

                commit('setUser', data.user);
                commit('setToken', data.token);
                commit('setRoles', data.user.roles);

                dispatch('setLogoutTimer', 600);
            } catch (error) {
                console.error(error);
            }
        },

        setLogoutTimer({ commit }, expirationTime) {
            setTimeout(() => {
                commit('clearAuthData');
                localStorage.removeItem('expirationDate');
                localStorage.removeItem('token');
                router.push('/login');
            }, expirationTime * 1000);
        },

        tryAutoLogin({ commit, dispatch }) {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const expirationDate = localStorage.getItem('expirationDate');
            const now = new Date();

            if (now >= expirationDate) {
                return;
            }
            dispatch('setLogoutTimer', 600);
            const user = JSON.parse(localStorage.getItem('user'));
            const roles = JSON.parse(localStorage.getItem('roles'));

            commit('setToken', token);
            commit('setUser', user);
            commit('setRoles', roles);
            router.push('/user');
        },

        logout({ commit }) {
            commit('clearAuthData');
        }
    }
});
