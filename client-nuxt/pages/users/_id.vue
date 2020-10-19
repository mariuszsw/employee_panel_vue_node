<template>
    <div>
        <Nuxt />
        <UserBoard />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import UserBoard from '~/components/UserBoard.vue';

export default {
    components: {
        UserBoard
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
        ...mapActions({ getContracts: 'contracts/getContracts' })
    }
};
</script>
