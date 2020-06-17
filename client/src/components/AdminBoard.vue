<template>
    <div class="container">
        <header class="jumbotron">
            <h3>{{content}}</h3>
        </header>
    </div>
</template>

// <script>
import UserService from '../services/UserService.js';

export default {
    name: 'Admin',
    data() {
        return {
            content: ''
        };
    },
    async mounted() {
        try {
            const { data } = await UserService.getAdminBoard();
            this.content = data;
        } catch (error) {
            this.content =
                (error.response && error.response.data ? error.response.data : null) ||
                error.message ||
                error.toString();
        }
    }
};
</script>
