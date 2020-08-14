import Vue from 'vue';
import Vuex from 'vuex';
import { router } from '../router';
import ContractService from '@/services/ContractService';
import UserService from '@/services/UserService.js';
import UserContractsService from '../services/UserContractsService';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    state: {
        token: null,
        user: [],
        index: null,
        roles: [],
        contracts: [],
        userId: null,
        selectedItem: null
    },
    getters: {
        isAuthenticated(state) {
            return state.token !== null;
        },
        isAdmin(state) {
            return !!state.roles.find((r) => r.name === 'admin');
        },
        isUser(state) {
            return !!state.roles.find((r) => r.name === 'user');
        },
        getUser(state) {
            return state.user;
        },
        getRoles(state) {
            return state.roles;
        },
        getContracts(state) {
            return state.contracts;
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
        },
        setContract(state, contracts) {
            state.contracts = contracts;
        },

        setUsers(state, payload) {
            state.user = payload.user;
        },

        DELETE_CONTRACT(state, contractId) {
            const index = state.contracts.findIndex((contract) => contract.id === contractId);

            state.contracts.splice(index, 1);
        },

        setUserId(state, userId) {
            state.userId = userId;
        },
        EDIT_CONTRACT(state, editedContract) {
            const index = state.contracts.findIndex((contract) => contract.id === editedContract.id);
            if (~index) {
                state.contracts.splice(index, 1, editedContract);
            }
        },

        ADD_CONTRACT(state, contract) {
            state.contracts.push(contract);
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

                dispatch('setLogoutTimer', 6000);
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
            }, expirationTime * 6000);
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
            dispatch('setLogoutTimer', 6000);
            const user = JSON.parse(localStorage.getItem('user'));
            const roles = JSON.parse(localStorage.getItem('roles'));

            commit('setToken', token);
            commit('setUser', user);
            commit('setRoles', roles);
            router.push('/user');
        },

        logout({ commit }) {
            commit('clearAuthData');
        },

        async removeContract({ commit }, contractId) {
            await ContractService.delete(contractId.id);
            commit('DELETE_CONTRACT', contractId.id);
        },

        async removeUser({ commit }, payload) {
            commit('setUsers', payload.users);

            const index = payload.users.findIndex((user) => user.id === payload.selectedItem.id);
            payload.users.splice(index, 1);

            await UserService.delete(payload.selectedItem.id);
        },

        async getContracts({ commit }, userId) {
            const { data } = await UserContractsService.index(userId);

            commit('setUserId', userId);
            commit('setContract', data);

            return data;
        }
    }
});
