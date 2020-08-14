<template>
    <div>
        <v-form>
            <v-container>
                <v-row :justify="justify">
                    <v-col cols="12" sm="6">
                        <v-card class="mx-auto" max-width="400">
                            <v-img
                                class="white--text align-end"
                                height="200px"
                                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                            >
                                <v-card-title>{{ currentUser.name }}</v-card-title>
                            </v-img>

                            <v-card-subtitle class="pb-20"></v-card-subtitle>

                            <v-card-text class="text--primary">
                                FIRST NAME: {{ currentUser.name }}
                                LAST NAME: {{ currentUser.surname }}
                                EMAIL: {{ currentUser.email }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            justify: 'center'
        };
    },

    computed: {
        ...mapGetters({
            currentUser: 'getUser'
        })
    }
};
</script>
<style scoped>
</style>
