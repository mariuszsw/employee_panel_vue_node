<template>
    <v-app>
        <app-header />
        <v-content>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Header from './components/Header.vue';
export default {
    name: 'app',
    components: {
        'app-header': Header
    }
};
</script>

<style>
.v-content {
    margin-top: auto;
}
</style>
