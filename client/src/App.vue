<template>
    <v-app>
        <v-content>
            <app-header />
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Header from './components/Header.vue';
import { mapActions } from 'vuex';

export default {
    name: 'app',
    components: {
        'app-header': Header
    },
    methods: {
        ...mapActions({
            tryAutoLogin: 'tryAutoLogin'
        })
    },
    created() {
        this.tryAutoLogin();
    }
};
</script>

<style>
.v-content {
    margin-top: auto;
}
</style>
