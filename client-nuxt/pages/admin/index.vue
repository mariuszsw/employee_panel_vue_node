<template>
    <div>
        <Nuxt />
        <AdminBoard />
    </div>
</template>

<script>
import { mapActions } from 'vuex';

import AdminBoard from '~/components/AdminBoard.vue';
export default {
    components: {
        AdminBoard
    },
    async asyncData({ store }) {
        try {
            await store.dispatch('users/getUsers');
        } catch (error) {
            console.error(error);
        }
    },

    computed: {
        ...mapActions({ getUsers: 'users/getUsers' })
    }
};
</script>
