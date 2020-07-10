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
                            <v-toolbar-title>CONTRACTS</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        color="primary"
                                        dark
                                        class="mb-2"
                                        v-bind="attrs"
                                        v-on="on"
                                    >New Contract</v-btn>
                                </template>

                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field
                                                        v-model="editedItem.startDate"
                                                        label="Start Contract"
                                                        required
                                                    ></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="6">
                                                    <v-select
                                                        v-model="editedItem.duration"
                                                        :items="[1, 2, 3, 6, 12]"
                                                        label="Duration Contract."
                                                        required
                                                    ></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select
                                                        v-model="editedItem.leave"
                                                        :items="[20, 26]"
                                                        label="Days off"
                                                    ></v-select>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                        <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>

                <v-dialog v-model="isDialogDeleteVisible" max-width="500px">
                    <v-card>
                        <v-card-title>Remove</v-card-title>
                        <v-card-text>Are you sure to delete?</v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" text @click="isDialogDeleteVisible = false">Close</v-btn>
                            <v-btn color="primary" text @click="deleteItem">Delete</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-app>
        </div>
    </div>
</template>

<script>
import ContractService from '../services/ContractService';
import UserContractsService from '../services/UserContractsService';

export default {
    name: 'Admin',
    data() {
        return {
            contracts: [],
            dialog: false,
            isDialogDeleteVisible: false,
            itemToDelete: {},
            headers: [
                { text: 'Start', value: 'startDate' },
                { text: 'Duration', value: 'duration' },
                { text: 'Leave', value: 'leave' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            editedItem: {},
            defaultItem: {
                startDate: '',
                duration: '',
                leave: ''
            }
        };
    },

    created() {
        this.editedItem = { ...this.defaultItem };
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
    },

    computed: {
        formTitle() {
            return this.editedItem.id ? 'Edit Contract' : 'New Contract';
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    methods: {
        editItem(item) {
            this.editedItem = { ...item };
            this.dialog = true;
        },

        async deleteItem() {
            const index = this.contracts.findIndex(
                c => c.id === this.itemToDelete.id
            );
            this.contracts.splice(index, 1);
            this.isDialogDeleteVisible = false;

            await ContractService.delete(this.itemToDelete.id);
            this.itemToDelete = { ...this.defaultItem };
        },

        showDeleteDialog(item) {
            this.itemToDelete = item;
            this.isDialogDeleteVisible = !this.isDialogDeleteVisible;
        },

        close() {
            this.dialog = false;
            this.editedItem = { ...this.defaultItem };
        },

        async save() {
            if (this.editedItem.id) {
                const index = this.contracts.findIndex(
                    c => c.id === this.editedItem.id
                );

                await ContractService.save(this.editedItem);

                this.$set(this.contracts, index, this.editedItem);
            } else {
                this.editedItem.userId = this.$route.params.userId;

                const { data } = await ContractService.save(this.editedItem);

                this.contracts.push(data);
            }

            this.close();
        }
    }
};
</script>

<style scoped>
v-btn {
    position: absolute;
}
</style>
