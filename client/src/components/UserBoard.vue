<template>
    <div class="container">
        <div id="app">
            <v-app id="inspire">
                <v-data-table
                    :headers="headers"
                    :items="contracts"
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
                </v-data-table>
            </v-app>
        </div>
    </div>
</template>

<script>
import UserContractsService from '../services/UserContractsService';

export default {
    name: 'Admin',
    data() {
        return {
            contracts: [],

            headers: [
                { text: 'Start', value: 'startDate' },
                { text: 'Duration', value: 'duration' },
                { text: 'Leave', value: 'leave' }
            ],

            defaultItem: {
                startDate: '',
                duration: '',
                leave: ''
            }
        };
    },

    async mounted() {
        try {
            const { userId } = this.$route.params;
            const { data } = await UserContractsService.index(userId);
            this.contracts = data;
        } catch (error) {
            this.errorMessage =
                (error.response && error.response.data
                    ? error.response.data
                    : null) ||
                error.message ||
                error.toString();
        }
    }
};
</script>

<style scoped>
v-btn {
    position: absolute;
}
</style>
