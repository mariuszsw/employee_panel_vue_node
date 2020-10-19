<template>
    <div class="container">
        <CreateOrEditLeave
            :is-open.sync="dialog"
            :selectedObject.sync="selectedItem"
            :isLeaves.sync="this.$store.state.leaves.leaves"
        />
        <header class="jumbotron">
            <div id="app">
                <v-app id="inspire">
                    <v-data-table
                        :headers="headers"
                        :items="this.$store.state.leaves.leaves"
                        sort-by="createdAt"
                        class="elevation-1"
                    >
                        <template v-slot:item.approved="{ item }">
                            <v-checkbox v-model="item.approved" disabled></v-checkbox>
                        </template>

                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-toolbar-title>LEAVE</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer />

                                <v-btn color="primary" dark class="mb-2" @click="onOpenCreateOrUpdateDialog()"
                                    >New Leave</v-btn
                                >
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                :disabled="isBoardAdmin ? false : item.approved"
                                small
                                class="mr-2"
                                @click="editItem(item)"
                                >mdi-pencil</v-icon
                            >
                            <v-icon v-if="isBoardAdmin" small @click="showDeleteDialog(item)">mdi-delete</v-icon>
                            <!-- <v-icon middle @click="contracts(item)">play_arrow</v-icon> -->
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
        </header>
    </div>
</template>

<script>
import CreateOrEditLeave from './CreateOrEditLeave';
import UserLeavesService from '../services/UserLeavesService.js';
import LeaveService from '../services/LeaveService.js';

import { mapGetters, mapActions } from 'vuex';

export default {
    props: {
        source: String
    },

    components: {
        CreateOrEditLeave
    },

    data() {
        return {
            selectedItem: {
                start: '',
                end: '',
                leaveDays: ''
            },
            serverErrors: {
                start: '',
                end: '',
                leaveDays: ''
            },

            dialog: false,
            isDialogDeleteVisible: false,

            headers: [
                { text: 'Start Leave', value: 'start' },
                { text: 'End Leave', value: 'end' },
                { text: 'Available Leave Days', value: 'leaveDays' },
                { text: 'Approve', value: 'approved' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],

            defaultItem: {
                start: '',
                end: '',
                leaveDays: ''
            }
        };
    },

    created() {
        this.selectedItem = { ...this.defaultItem };
    },

    computed: {
        ...mapGetters({
            isAuthenticated: 'authentication/isAuthenticated',
            isAdmin: 'authentication/isAdmin',
            isUser: 'authentication/isUser',
            currentUser: 'users/getUser'
        }),

        isBoardAdmin() {
            return this.currentUser && this.isAdmin;
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    methods: {
        ...mapActions({
            removeLeave: 'leaves/removeLeave'
        }),

        editItem(item) {
            this.selectedItem = { ...item };
            this.dialog = true;
        },

        onDeleteItem() {
            this.removeLeave(this.selectedItem);
            this.isDialogDeleteVisible = false;
        },

        async onDelete() {
            const index = this.$store.state.leaves.findIndex((leave) => leave.id === this.selectedItem.id);
            this.$store.state.leaves.splice(index, 1);
            this.isDialogDeleteVisible = false;

            await LeaveService.delete(this.selectedItem.id);

            this.selectedItem = { ...this.defaultItem };
        },

        showDeleteDialog(item) {
            this.selectedItem = item;
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
        }
    }
};
</script>
