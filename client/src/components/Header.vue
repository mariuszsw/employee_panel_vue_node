<template>
    <v-toolbar fixed class="indigo" dark>
        <v-spacer></v-spacer>

        <v-toolbar-items>
            <v-btn v-if="!isAuthenticated" text dark router to="/login">Login</v-btn>
            <v-btn v-if="isAuthenticated" text dark router to="/user">Profil</v-btn>
            <v-btn v-if="isAdminBoard" text dark router to="/admin">Admin Board</v-btn>
            <v-btn
                v-if="isUserBoard"
                text
                dark
                router
                :to="{ path: '/users/' + this.currentUser.id }"
            >User Board</v-btn>

            <v-btn v-if="isAuthenticated" text dark @click="onLogout">Log Out</v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated',
            isAdmin: 'auth/isAdmin',
            isUser: 'auth/isUser',
            currentUser: 'users/getUser'
        }),

        isAdminBoard() {
            return this.currentUser && this.isAdmin;
        },

        isUserBoard() {
            return this.currentUser && this.isUser;
        }
    },
    methods: {
        ...mapActions({
            logout: 'auth/logout'
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
