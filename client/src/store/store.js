import Vue from 'vue';
import Vuex from 'vuex';

import users from './modules/users';
import contracts from './modules/contracts';
import auth from './modules/auth.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        users,
        contracts
    }
});
