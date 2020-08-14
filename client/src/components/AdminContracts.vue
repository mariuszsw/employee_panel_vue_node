<template>
    <div class="container">
        <Create-Or-Edit-Contract
            :is-open.sync="dialog"
            :selected-object.sync="selectedItem"
            :arr-contracts.sync="contracts"
        />

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
                            <v-toolbar-title>CONTRACTS</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                @click="onOpenCreateOrUpdateDialog()"
                            >New Contract</v-btn>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                        <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
                        <!-- <v-icon middle @click="goToRouteLeaves(item)">play_arrow</v-icon> -->
                    </template>
                </v-data-table>

                <v-dialog v-model="isDialogDeleteVisible" max-width="500px">
                    <v-card>
                        <v-card-title>Remove</v-card-title>
                        <v-card-text>Are you sure to delete?</v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" text @click="isDialogDeleteVisible = false">Close</v-btn>
                            <v-btn color="primary" text @click="onDeleteItem">Delete</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-app>
        </div>
    </div>
</template>

<script>
import CreateOrEditContract from './CreateOrEditContract';
// import UserContractsService from '../services/UserContractsService';
import { mapActions } from 'vuex';

export default {
    name: 'Admin',

    components: {
        CreateOrEditContract
    },

    data() {
        return {
            selectedItem: {
                startDate: ''
            },
            serverErrors: {
                startDate: ''
            },
            errorMessage: '',
            error: null,
            contracts: [],
            dialog: false,

            isDialogDeleteVisible: false,
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

    created() {
        this.selectedItem = { ...this.defaultItem };
    },

    async mounted() {
        try {
            const { userId } = this.$route.params;
            //  const { data } = await UserContractsService.index(userId);
            //  this.contracts = data;
            this.contracts = await this.getContracts(userId);
        } catch (error) {
            this.errorMessage =
                (error.response && error.response.data ? error.response.data : null) ||
                error.message ||
                error.toString();
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    methods: {
        editItem(item) {
            this.selectedItem = { ...item };
            this.dialog = true;
        },

        ...mapActions({
            removeContract: 'removeContract',
            getContracts: 'getContracts'
        }),
        onDeleteItem() {
            this.removeContract(this.selectedItemlete);
            this.isDialogDeleteVisible = false;
        },

        showDeleteDialog(item) {
            this.selectedItemlete = item;
            this.isDialogDeleteVisible = !this.isDialogDeleteVisible;
        },

        close() {
            this.dialog = false;
            this.selectedItem = { ...this.defaultItem };
        },

        onOpenCreateOrUpdateDialog(item = {}) {
            this.dialog = true;

            if (item.id) {
                this.selectedItem = item;
            }
        },

        goToRouteLeaves(item) {
            this.$router.push(`/leaves/${item.id}`);
        }
    }
};
</script>

<style scoped>
v-btn {
    position: absolute;
}
</style>
