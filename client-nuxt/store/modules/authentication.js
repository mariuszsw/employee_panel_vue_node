export default {
    namespaced: true,
    state: { token: '', roles: [] },
    mutations: {
        setToken(state, token) {
            state.token = token;

            if (!process.server) {
                localStorage.setItem('token', token);
            }
        },

        setRoles(state, roles) {
            state.roles = roles;

            if (!process.server) {
                localStorage.setItem('roles', JSON.stringify(roles));
            }
        },

        clearAuthData(state) {
            state.token = null;
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
                const expirationDate = new Date(now.getTime() + 6000 * 1000); //take from backend

                localStorage.setItem('expirationDate', expirationDate);
                commit('setToken', data.token);
                commit('setRoles', data.user.roles);
                commit('users/setUser', data.user, { root: true });

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
            commit('users/setUser', user, { root: true });
            commit('setRoles', roles);
            router.push('/user');
        },

        logout({ commit }) {
            commit('clearAuthData');
        }
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

        getRoles(state) {
            return state.roles;
        }
    }
};
