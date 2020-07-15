<template>
    <div class="container">
        <header class="jumbotron">
            <div id="app">
                <v-app id="inspire">
                    <v-data-table :headers="headers" :items="users" sort-by="createdAt" class="elevation-1">
                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-toolbar-title>EMPLOYEE PANEL</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer />
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                                            >New Employee</v-btn
                                        >
                                    </template>

                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">
                                                {{ formTitle }}
                                            </span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-form>
                                                <v-container>
                                                    <v-row>
                                                        <v-col cols="2" sm="6" md="400">
                                                            <v-text-field
                                                                label="Employee Name"
                                                                name="name"
                                                                prepend-icon="person"
                                                                type="text"
                                                                required
                                                                v-model="selectedItem.name"
                                                                :rules="nameErrors"
                                                                @input="$v.selectedItem.name.$touch()"
                                                                @blur="$v.selectedItem.name.$touch()"
                                                                @keyup="clearServerErrors('name')"
                                                            />
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="400">
                                                            <v-text-field
                                                                label="Employee Surname"
                                                                name="surname"
                                                                prepend-icon="person"
                                                                type="text"
                                                                required
                                                                v-model="selectedItem.surname"
                                                                :rules="surnameErrors"
                                                                @input="$v.selectedItem.surname.$touch()"
                                                                @blur="$v.selectedItem.surname.$touch()"
                                                                @keyup="clearServerErrors('surname')"
                                                            />
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="4">
                                                            <v-menu
                                                                ref="birthdateButton"
                                                                v-model="birthdateButton"
                                                                :close-on-content-click="false"
                                                                transition="scale-transition"
                                                                offset-y
                                                                min-width="290px"
                                                            >
                                                                <template
                                                                    v-slot:activator="{
                                                                        on,
                                                                        attrs
                                                                    }"
                                                                >
                                                                    <v-text-field
                                                                        v-model="selectedItem.birthdate"
                                                                        label="Birthday date"
                                                                        prepend-icon="event"
                                                                        readonly
                                                                        v-bind="attrs"
                                                                        v-on="on"
                                                                    />
                                                                </template>
                                                                <v-date-picker
                                                                    name="birthdate"
                                                                    ref="picker"
                                                                    v-model="selectedItem.birthdate"
                                                                    :max="new Date().toISOString().substr(0, 10)"
                                                                    min="1900-01-01"
                                                                    @change="saveBirthdate"
                                                                ></v-date-picker>
                                                            </v-menu>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="24">
                                                            <v-text-field
                                                                v-model="selectedItem.email"
                                                                label="Email"
                                                                name="email"
                                                                prepend-icon="email"
                                                                type="text"
                                                                required
                                                                :rules="emailErrors"
                                                                @input="$v.selectedItem.email.$touch()"
                                                                @blur="$v.selectedItem.email.$touch()"
                                                                @keyup="clearServerErrors('email')"
                                                            />
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="24">
                                                            <v-text-field
                                                                v-model="selectedItem.password"
                                                                label="Password"
                                                                prepend-icon="lock"
                                                                type="password"
                                                                required
                                                                :rules="passwordErrors"
                                                                @input="$v.selectedItem.password.$touch()"
                                                                @blur="$v.selectedItem.password.$touch()"
                                                                @keyup="clearServerErrors('password')"
                                                            />
                                                        </v-col>
                                                        <v-alert :value="validationError" color="error" v-html="error">
                                                            {{ errorMessage }}
                                                        </v-alert>
                                                    </v-row>
                                                </v-container>
                                            </v-form>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer />
                                            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                            <v-btn color="blue darken-1" @click="onSave" :disabled="!isValid"
                                                >Save</v-btn
                                            >
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                            <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
                            <v-icon middle @click="contracts(item)">play_arrow</v-icon>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="isDialogDeleteVisible" max-width="500px">
                        <v-card>
                            <v-card-title>Remove</v-card-title>
                            <v-card-text>Are you sure to delete?</v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" text @click="isDialogDeleteVisible = false">Close</v-btn>
                                <v-btn color="primary" text @click="onDelete">Delete</v-btn>
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
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';

export default {
    name: 'Admin',
    mixins: [validationMixin],
    props: {
        source: String
    },
    validations: {
        selectedItem: {
            name: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(40)
            },
            surname: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(40)
            },
            email: { required, email },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(32)
            }
        }
    },

    data() {
        return {
            selectedItem: {},
            serverErrors: {
                name: [],
                surname: [],
                email: [],
                birthdate: '',
                password: []
            },
            errorMessage: '',
            error: null,
            validationError: false,
            users: [],
            dialog: false,
            isDialogDeleteVisible: false,
            birthdateButton: false,

            headers: [
                { text: 'First Name', value: 'name' },
                { text: 'Last Name', value: 'surname' },
                { text: 'Birdth date', value: 'birthdate' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false }
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
    computed: {
        formTitle() {
            return this.selectedItem.id ? 'Edit Employee' : 'New Employee';
        },
        nameErrors() {
            const errors = [];

            if (!this.$v.selectedItem.name.$dirty) return errors;
            (!this.$v.selectedItem.name.minLength || !this.$v.selectedItem.name.maxLength) &&
                errors.push('Name must be 2-40 characters in length');
            !this.$v.selectedItem.name.required && errors.push('Name is required');
            this.serverErrors.name.length && this.serverErrors.name.forEach((err) => errors.push(err));

            return errors;
        },
        surnameErrors() {
            const errors = [];

            if (!this.$v.selectedItem.surname.$dirty) {
                return errors;
            }
            (!this.$v.selectedItem.surname.minLength || !this.$v.selectedItem.surname.maxLength) &&
                errors.push('Surname must be 2-40 characters in length');
            !this.$v.selectedItem.surname.required && errors.push('Surname is required');
            this.serverErrors.surname.length && this.serverErrors.surname.forEach((err) => errors.push(err));

            return errors;
        },
        emailErrors() {
            const errors = [];

            if (!this.$v.selectedItem.email.$dirty) {
                return errors;
            }
            !this.$v.selectedItem.email && errors.push('Must be valid e-mail');
            !this.$v.selectedItem.email.required && errors.push('E-mail is required');
            this.serverErrors.email.length && this.serverErrors.email.forEach((err) => errors.push(err));

            return errors;
        },
        passwordErrors() {
            const errors = [];

            if (!this.$v.selectedItem.password.$dirty) {
                return errors;
            }
            (!this.$v.selectedItem.password.minLength || !this.$v.selectedItem.password.maxLength) &&
                errors.push('Password must be 6-32 characters in length');
            !this.$v.selectedItem.password.required && errors.push('Password is required');
            this.serverErrors.password.length && this.serverErrors.password.forEach((err) => errors.push(err));

            return errors;
        },

        isValid() {
            return !this.$v.$invalid;
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
        birthdateButton(val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
        }
    },

    methods: {
        editItem(item) {
            this.selectedItem = { ...item, password: '' };
            this.dialog = true;
        },

        async onDelete() {
            const index = this.users.findIndex((user) => user.id === this.selectedItem.id);
            this.users.splice(index, 1);
            this.isDialogDeleteVisible = false;

            await UserService.delete(this.selectedItem.id);
            this.selectedItem = { ...this.defaultItem };
        },

        showDeleteDialog(item) {
            this.selectedItem = item;
            this.isDialogDeleteVisible = !this.isDialogDeleteVisible;
        },

        close() {
            this.dialog = false;
            this.selectedItem = { ...this.defaultItem };
            this.$v.$reset();
        },

        async onSave() {
            try {
                const { data } = await UserService.save(this.selectedItem);
                this.validationError = false;

                if (this.selectedItem.id) {
                    const index = this.users.findIndex((user) => user.id === this.selectedItem.id);

                    this.$set(this.users, index, this.selectedItem);
                } else {
                    this.users.push(data);
                }
            } catch (error) {
                if (error.status === 400) {
                    error.data.errors.map((error) => {
                        if (this.serverErrors[error.param]) {
                            this.serverErrors[error.param].push(error.message);
                        }
                    });
                }

                if (error.status === 401) {
                    this.errorMessage = 'Invalid credentials!';
                }
            }

            this.close();
        },

        contracts(item) {
            this.$router.push(`/contracts/${item.id}`);
        },

        saveBirthdate(selectedItem) {
            this.$refs.birthdateButton.save(selectedItem.birthdate);
        },

        clearServerErrors(type) {
            this.serverErrors[type] = [];
        }
    }
};
</script>
