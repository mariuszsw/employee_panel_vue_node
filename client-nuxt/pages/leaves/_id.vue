<template>
    <div>
        <Nuxt />
        <AdminLeave />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import AdminLeave from '~/components/AdminLeave.vue';

export default {
    components: {
        AdminLeave
    },

    async asyncData({ store, params }) {
        try {
            const { id } = params;

            await store.dispatch('leaves/getLeaves', id);
        } catch (error) {
            console.error(error);
        }
    },

    computed: {
        ...mapActions({ getUsers: 'users/getUsers' })
    }
};
</script>
