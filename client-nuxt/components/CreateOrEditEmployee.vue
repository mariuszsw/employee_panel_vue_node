<template>
    <v-row justify="center">
        <v-dialog v-model="open" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="2" sm="6" md="400">
                                <v-text-field
                                    v-model="selectedItem.name"
                                    label="Employee Name"
                                    name="name"
                                    prepend-icon="person"
                                    type="text"
                                    required
                                    :rules="nameErrors"
                                    @input="$v.selectedItem.name.$touch()"
                                    @blur="$v.selectedItem.name.$touch()"
                                    @keyup="clearServerErrors('name')"
                                />
                            </v-col>

                            <v-col cols="12" sm="6" md="400">
                                <v-text-field
                                    v-model="selectedItem.surname"
                                    label="Employee Surname"
                                    name="surname"
                                    prepend-icon="person"
                                    type="text"
                                    required
                                    :rules="surnameErrors"
                                    @input="$v.selectedItem.surname.$touch()"
                                    @blur="$v.selectedItem.surname.$touch()"
                                    @keyup="clearServerErrors('surname')"
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-menu
                                    v-model="birthdateButton"
                                    ref="birthdateButton"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="selectedItem.birthdate"
                                            label="Birthday date"
                                            prepend-icon="event"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            :rules="birthdate"
                                            @input="$v.selectedItem.birthdate.$touch()"
                                            @blur="$v.selectedItem.birthdate.$touch()"
                                            @keyup="clearServerErrors('birthdate')"
                                        />
                                    </template>
                                    <v-date-picker
                                        v-model="selectedItem.birthdate"
                                        name="birthdate"
                                        ref="picker"
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
                            <v-alert :value="validationError" color="error" v-html="error">{{ errorMessage }}</v-alert>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" @click="onSave" :disabled="!isValid">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
    mixins: [validationMixin],

    props: {
        isOpen: Boolean,
        selectedObject: {
            Object,
            default: () => {
                return {};
            }
        }
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
            },

            birthdate: {
                required
            }
        }
    },

    data() {
        return {
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
            birthdateButton: false,
            isCreateOrUpdateDialogVisible: false
        };
    },
    computed: {
        open: {
            get() {
                return this.isOpen;
            },

            set(newValue) {
                this.$emit('update:isOpen', newValue);
            }
        },

        selectedItem: {
            get() {
                return this.selectedObject;
            },

            set(newValue) {
                this.$emit('update:selectedObject', newValue);
            }
        },

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

        birthdate() {
            const errors = [];

            if (!this.$v.selectedItem.birthdate.$dirty) {
                return errors;
            }
            !this.$v.selectedItem.birthdate.required && errors.push('Birthdate is required');

            return errors;
        },

        isValid() {
            return !this.$v.$invalid;
        }
    },

    watch: {
        birthdateButton(val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
        }
    },

    methods: {
        ...mapActions({
            saveUser: 'users/saveUser'
        }),

        close() {
            this.open = false;
            this.selectedItem = { ...this.defaultItem };
            this.$v.$reset();
        },

        onSave() {
            try {
                this.validationError = false;

                this.saveUser(this.selectedItem);
            } catch (error) {
                if (error.status === 400) {
                    error.data.errors.map((error) => {
                        if (this.serverErrors[error.param]) {
                            return this.serverErrors[error.param].push(error.message);
                        }
                    });
                }

                if (error.status === 401) {
                    this.errorMessage = 'Invalid Create or Edit Employee!';
                    this.$router.push('login');
                }
            }

            this.close();
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
