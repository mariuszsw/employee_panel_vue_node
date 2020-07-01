<template>
    <div class="container">
        <header class="jumbotron">
            <div id="app">
                <v-app id="inspire">
                    <v-data-table
                        :headers="headers"
                        :items="users"
                        sort-by="surname"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-toolbar-title>ADMIN PANEL</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <!-- <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            >New Item</v-btn
                                        >
                                    </template>-->

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
                            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                            <v-icon middle @click="contracts(item)">play_arrow</v-icon>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary" @click="initialize">Reset</v-btn>
                        </template>
                    </v-data-table>
                </v-app>
            </div>
        </header>
    </div>
</template>

<script>
import UserService from '../services/UserService.js';

export default {
    name: 'Admin',
    data() {
        return {
            content: '',
            dialog: false,
            headers: [
                { text: 'First Name', value: 'name' },
                { text: 'Last Name', value: 'surname' },
                { text: 'Birdth date', value: 'birthdate' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            users: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                surname: '',
                email: '',
                birthdate: 0,
                password: 0
            },
            defaultItem: {
                name: '',
                surname: '',
                email: '',
                birthdate: 0,
                password: ''
            }
        };
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New User' : 'Edit Item';
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    methods: {
        initialize() {
            this.users = this.content;
        },

        editItem(item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem(item) {
            const index = this.users.indexOf(item);
            
            if (confirm('Are you sure you want to delete this item?')) {
                UserService.deleteUser(item.id);
                this.users.splice(index, 1);
            }
        },

        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = { ...this.defaultItem };
                this.editedIndex = -1;
            });
        },

        save() {
            if (this.editedIndex > -1) {
                try {
                    UserService.putUser(this.users[this.editedIndex]);
                    Object.assign(
                        this.users[this.editedIndex],
                        this.editedItem
                    );
                } catch (error) {
                    console.error(error);
                }
            } else {
                this.users.push(this.editedItem);
            }
            this.close();
        },
        contracts(item) {
            this.$router.push(`/contracts/${item.id}`);
        }
    },

    async mounted() {
        try {
            const { data } = await UserService.getAdminBoard();
            this.content = data;
            this.initialize();
        } catch (error) {
            this.content =
                (error.response && error.response.data
                    ? error.response.data
                    : null) ||
                error.message ||
                error.toString();
        }
    }
};
</script>
