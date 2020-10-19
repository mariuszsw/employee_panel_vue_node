import Vue from 'vue';
import Vuex from 'vuex';
import users from './modules/users';
import contracts from './modules/contracts';
import leaves from './modules/leaves';
import authentication from './modules/authentication';
import Api from '@/services/Api';

const jwt = require('jsonwebtoken');

Vue.use(Vuex);

const createStore = () => {
    return new Vuex.Store({
        modules: {
            authentication,
            users,
            contracts,
            leaves
        },

        actions: {
            async nuxtServerInit({ commit, state }, { req }) {
                const cookies = req.headers.cookie;

                if (cookies && this.$auth.loggedIn) {
                    const token = cookies.split('%20')[1];

                    const { user } = jwt.decode(token.split('; ')[0]);
                    const roles = [{ id: user.roles[0].id, name: user.roles[0].name }];

                    commit('users/setUser', user);
                    commit('authentication/setRoles', roles);

                    Api.defaults.headers = { 'x-access-token': token.split('; ')[0] };
                }
            }
        }
    });
};

export default createStore;
