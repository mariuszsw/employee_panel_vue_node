<template>
    <div>
        <p>You're authenticated!</p>
        <h1>{{ currentUser.name }}</h1>
        <h1>{{ currentUser.surname }}</h1>
        <h1>{{ currentUser.email }}</h1>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            currentUser: 'getUser'
        })
    }
};
</script>
<style scoped>
</style>
