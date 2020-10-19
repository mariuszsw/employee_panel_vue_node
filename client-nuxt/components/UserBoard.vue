<template>
    <div class="container">
        <div id="app">
            <v-app id="inspire">
                <v-data-table
                    :headers="headers"
                    :items="this.$store.state.contracts"
                    sort-by="createdAt"
                    class="elevation-1"
                >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                            <v-toolbar-title>USER CONTRACTS</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions>
                        <v-icon middle @click="goToRouteLeaves">play_arrow</v-icon>
                    </template>
                </v-data-table>
            </v-app>
        </div>
    </div>
</template>

<script>
import UserContractsService from '../services/UserContractsService';
import { mapGetters } from 'vuex';

export default {
    name: 'User',

    data() {
        return {
            contracts: [],

            headers: [
                { text: 'Start', value: 'startDate' },
                { text: 'Duration', value: 'duration' },
                { text: 'Leave', value: 'leave' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],

            defaultItem: {
                startDate: '',
                duration: '',
                leave: ''
            }
        };
    },

    computed: {
        ...mapGetters({
            currentUser: 'users/getUser'
        })
    },

    methods: {
        goToRouteLeaves() {
            this.$router.push(`/leaves/${this.currentUser.id}`);
        }
    }
};
</script>

<style scoped>
v-btn {
    position: absolute;
}
</style>
