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
        user: null,
        users: [],
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

        addUser(state, data) {
            state.users.push(data);
        },

        updateUser(state, data) {
            const index = state.users.findIndex((user) => user.id === data.id);

            if (~index) {
                state.users.splice(index, 1, data);
            }
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
        setContracts(state, contracts) {
            state.contracts = contracts;
        },

        setUsers(state, payload) {
            state.users = payload;
        },

        deleteUser(state, userId) {
            const index = state.users.findIndex((user) => user.id === userId);
            state.users.splice(index, 1);
        },

        deleteContract(state, contractId) {
            const index = state.contracts.findIndex((contract) => contract.id === contractId);

            state.contracts.splice(index, 1);
        },

        updateContract(state, editedContract) {
            const index = state.contracts.findIndex((contract) => contract.id === editedContract.id);
            if (~index) {
                state.contracts.splice(index, 1, editedContract);
            }
        },

        addContract(state, contract) {
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

            commit('deleteContract', contractId.id);
        },

        async removeUser({ commit }, user) {
            await UserService.delete(user.id);

            commit('deleteUser', user.id);
        },

        async getContracts({ commit }, userId) {
            const { data } = await UserContractsService.index(userId);

            commit('setContracts', data);

            return data;
        },

        async getUsers({ commit }) {
            const { data } = await UserService.index();

            commit('setUsers', data);
            return data;
        },

        async updateUser({ commit }, editedUser) {
            await UserService.save(editedUser);

            commit('updateUser', editedUser);
        },

        async addUser({ commit }, editedUser) {
            const { data } = await UserService.save(editedUser);
            commit('addUser', data);
        },

        async saveUser({ dispatch }, selectedItem) {
            if (selectedItem.id) {
                dispatch('updateUser', selectedItem);
            } else {
                dispatch('addUser', selectedItem);
            }
        },

        async saveContract({ commit }, selectedItem) {
            if (selectedItem.id) {
                await ContractService.save(selectedItem);

                commit('updateContract', selectedItem);
            } else {
                const { data } = await ContractService.save(selectedItem);

                commit('addContract', data);
            }
        }
    }
});
