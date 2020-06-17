<template>
    <v-toolbar fixed class="indigo" dark>
        <v-toolbar-title class="mr-4" dark @click="navaigateTo('home')">Dashboard</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
            <v-btn v-if="!isAuthenticated" text dark router to="/login">Login</v-btn>
            <v-btn v-if="showAdminBoard" text dark router to="/signup">Sign Up</v-btn>
            <v-btn v-if="isAuthenticated" text dark router to="/user">Profil</v-btn>
            <v-btn v-if="showAdminBoard" text dark router to="/admin">Admin Board</v-btn>
            <v-btn v-if="isAuthenticated" text dark @click="onLogout">Log Out</v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            isAuthenticated: 'isAuthenticated',
            isAdmin: 'isAdmin',
            currentUser: 'getUser'
        }),

        showAdminBoard() {
           return this.currentUser && this.isAdmin;
        }
    },
    methods: {
        ...mapActions({
            logout: 'logout'
        }),
        onLogout() {
            this.logout();
            this.$router.push('/login');
        }
    }
};
</script>
<style scoped>
.mr-4 {
    cursor: pointer;
}
.mr-4:hover {
    color: black;
}
</style>
