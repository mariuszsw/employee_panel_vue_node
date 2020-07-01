<template>
    <div class="container">
        <header class="jumbotron">
            <h4>Hello</h4>
            <h3>{{ content }}</h3>
        </header>
    </div>
</template>

<script>
import UserService from '@/services/UserService.js';

export default {
    name: 'User',
    data() {
        return {
            content: ''
        };
    },
    async mounted() {
        try {
            const userId = this.$route.params.userId;
            const { data } = await UserService.getUserBoard(userId);
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
