<template>
    <div class="container">
        <Create-Or-Edit-Employee
            :is-open.sync="dialog"
            :selectedObject.sync="selectedItem"
            :selectedUsers.sync="users"
        />

        <ConfirmDeleteUser
            :is-open.sync="isDialogDeleteVisible"
            @closeDialog="close"
            @confirmDelete="onDelete()"
        />

        <header class="jumbotron">
            <div id="app">
                <v-app id="inspire">
                    <v-data-table
                        :headers="headers"
                        :items="users"
                        sort-by="createdAt"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-toolbar-title>EMPLOYEE PANEL</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer />

                                <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    @click="onOpenCreateOrUpdateDialog()"
                                >New Employee</v-btn>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                            <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
                            <v-icon middle @click="contracts(item)">play_arrow</v-icon>
                        </template>
                        <template v-slot:item.leaves="{ item }">
                            <v-icon middle @click="goToRouteLeaves(item)">play_arrow</v-icon>
                        </template>
                    </v-data-table>
                </v-app>
            </div>
        </header>
    </div>
</template>

<script>
import UserService from '../services/UserService.js';
import CreateOrEditEmployee from './CreateOrEditEmployee';
import ConfirmDeleteUser from './ConfirmDeleteUser';

import { mapActions } from 'vuex';

export default {
    name: 'Admin',
    props: {
        source: String
    },
    components: {
        CreateOrEditEmployee,
        ConfirmDeleteUser
    },

    data() {
        return {
            selectedItem: {},

            users: [],
            dialog: false,
            isDialogDeleteVisible: false,

            headers: [
                { text: 'First Name', value: 'name' },
                { text: 'Last Name', value: 'surname' },
                { text: 'Birdth date', value: 'birthdate' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false },
                { text: 'Leaves', value: 'leaves', sortable: false }
            ],

            defaultItem: {
                name: '',
                surname: '',
                email: '',
                birthdate: '',
                password: ''
            }
        };
    },

    created() {
        this.selectedItem = { ...this.defaultItem };
    },

    async mounted() {
        try {
            const { userId } = this.$route.params;
            const { data } = await UserService.index(userId);
            this.users = data;
        } catch (error) {
            this.content =
                (error.response && error.response.data ? error.response.data : null) ||
                error.message ||
                error.toString();
        }
    },

    methods: {
        editItem(item) {
            this.selectedItem = { ...item, password: '' };

            this.onOpenCreateOrUpdateDialog();
        },

        ...mapActions(['removeUser']),
        onDelete() {
            this.removeUser({ users: this.users, selectedItem: this.selectedItem });
            this.isDialogDeleteVisible = false;
        },

        showDeleteDialog(item) {
            this.selectedItem = item;
            this.isDialogDeleteVisible = !this.isDialogDeleteVisible;
        },

        onOpenCreateOrUpdateDialog(item = {}) {
            this.dialog = true;

            if (item.id) {
                this.selectedItem = item;
            }
        },

        contracts(item) {
            this.$router.push(`/contracts/${item.id}`);
        },

        saveBirthdate(selectedItem) {
            this.$refs.birthdateButton.save(selectedItem.birthdate);
        },

        clearServerErrors(type) {
            this.serverErrors[type] = [];
        },

        close() {
            this.isDialogDeleteVisible = false;
            this.selectedItem = { ...this.defaultItem };
        },
        goToRouteLeaves(item) {
            this.$router.push(`/leaves/${item.id}`);
        }
    }
};
</script>
