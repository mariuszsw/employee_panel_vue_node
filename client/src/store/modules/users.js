import UserService from '@/services/UserService.js';

export default {
    namespaced: true,
    state: {
        user: null,
        users: [],
        index: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
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

        setUsers(state, payload) {
            state.users = payload;
        },

        deleteUser(state, userId) {
            const index = state.users.findIndex((user) => user.id === userId);
            state.users.splice(index, 1);
        }
    },
    actions: {
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

        async removeUser({ commit }, user) {
            await UserService.delete(user.id);

            commit('deleteUser', user.id);
        },

        async getUsers({ commit }) {
            const { data } = await UserService.index();

            commit('setUsers', data);
            return data;
        }
    },
    getters: {
        getUser(state) {
            return state.user;
        }
    }
};
