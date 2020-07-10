<template>
    <div class="container">
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
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                        >New Employee</v-btn>
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
                                                            v-model="
                                                                editedItem.name
                                                            "
                                                            label="Name"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field
                                                            v-model="
                                                                editedItem.surname
                                                            "
                                                            label="LastName"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field
                                                            v-model="
                                                                editedItem.birthdate
                                                            "
                                                            label="Birdth date"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="24">
                                                        <v-text-field
                                                            v-model="
                                                                editedItem.email
                                                            "
                                                            label="Email"
                                                        ></v-text-field>
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
                            <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
                            <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
                            <v-icon middle @click="contracts(item)">play_arrow</v-icon>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="isDialogDeleteVisible" max-width="500px">
                        <v-card>
                            <v-card-title>Remove</v-card-title>
                            <v-card-text>Are you sure to delete?</v-card-text>
                            <v-card-actions>
                                <v-btn
                                    color="primary"
                                    text
                                    @click="isDialogDeleteVisible = false"
                                >Close</v-btn>
                                <v-btn color="primary" text @click="deleteItem">Delete</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-app>
            </div>
        </header>
    </div>
</template>

<script>
import UserService from '../services/UserService.js';
import UsersListService from '../services/UsersListService.js';

export default {
    name: 'Admin',
    data() {
        return {
            users: [],
            dialog: false,
            isDialogDeleteVisible: false,
            headers: [
                { text: 'First Name', value: 'name' },
                { text: 'Last Name', value: 'surname' },
                { text: 'Birdth date', value: 'birthdate' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            editedItem: {},

            defaultItem: {
                name: '',
                surname: '',
                email: '',
                birthdate: 0,
                password: ''
            }
        };
    },

    created() {
        this.editedItem = { ...this.defaultItem };
    },

    async mounted() {
        try {
            const { userId } = this.$route.params;
            const { data } = await UsersListService.index(userId);
            this.users = data;
        } catch (error) {
            this.content =
                (error.response && error.response.data
                    ? error.response.data
                    : null) ||
                error.message ||
                error.toString();
        }
    },
    computed: {
        formTitle() {
            return this.editedItem.id ? 'New User' : 'Edit Item';
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
            const index = this.users.findIndex(
                c => c.id === this.itemToDelete.id
            );
            this.users.splice(index, 1);
            this.isDialogDeleteVisible = false;

            await UserService.delete(this.itemToDelete.id);
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
                const index = this.users.findIndex(
                    c => c.id === this.editedItem.id
                );

                await UserService.save(this.editedItem);

                this.$set(this.users, index, this.editedItem);
            } else {
                this.editedItem.userId = this.$route.params.userId;

                const { data } = await UserService.save(this.editedItem);

                this.users.push(data);
            }

            this.close();
        },

        contracts(item) {
            this.$router.push(`/contracts/${item.id}`);
        }
    }
};
</script>
