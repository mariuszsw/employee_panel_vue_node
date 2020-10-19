<template>
    <div>
        <Nuxt />
        <AdminContracts />
    </div>
</template>

<script>
import AdminContracts from '~/components/AdminContracts';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        AdminContracts
    },

    async asyncData({ store, params }) {
        try {
            const { id } = params;

            await store.dispatch('contracts/getContracts', id);
        } catch (error) {
            console.error(error);
        }
    },

    computed: {
        ...mapActions({ getContract: 'getContract' })
    }
};
</script>
