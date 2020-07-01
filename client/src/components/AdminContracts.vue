<template>
    <h2>Contracts</h2>
</template>

<script>
import UserService from '../services/UserService.js';

export default {
    async mounted() {
        try {
            const { data } = await UserService.getAdminBoard();
            this.content = data;
        } catch (error) {
            this.content =
                (error.response && error.response.data
                    ? error.response.data
                    : null) ||
                error.message ||
                error.toString();
        }
    }
};
</script>
