<template>
    <v-toolbar fixed class="indigo" dark>
        <v-toolbar-title class="mr-4" dark @click="navaigateTo('home')"
            >Dashboard</v-toolbar-title
        >

        <v-spacer></v-spacer>

        <v-toolbar-items>
            <v-btn text dark router to="/login">Login</v-btn>
            <v-btn text dark router to="/signup">Sign Up</v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
export default {
    methods: {
        navaigateTo(route) {
            this.$router.push(route);
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
