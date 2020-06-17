<template>
    <v-app id="inspire">
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-toolbar-title>Register Employeeform</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn :href="source" icon large target="_blank" v-on="on"></v-btn>
                                    </template>
                                    <span>Source</span>
                                </v-tooltip>
                            </v-toolbar>
                            <v-card-text>
                                <v-form v-model="isValid">
                                    <v-text-field
                                        label="Employee Name"
                                        name="name"
                                        prepend-icon="person"
                                        type="text"
                                        required
                                        v-model="credentials.name"
                                        :error-messages="nameErrors"
                                        @input="$v.credentials.name.$touch()"
                                        @blur="$v.credentials.name.$touch()"
                                        @keyup="clearServerErrors('name')"
                                    ></v-text-field>
                                    <v-text-field
                                        label="Employee Surname"
                                        name="surname"
                                        prepend-icon="person"
                                        type="text"
                                        required
                                        v-model="credentials.surname"
                                        :error-messages="surnameErrors"
                                        @input="$v.credentials.surname.$touch()"
                                        @blur="$v.credentials.surname.$touch()"
                                        @keyup="clearServerErrors('surname')"
                                    ></v-text-field>

                                    <v-text-field
                                        v-model="credentials.email"
                                        label="Email"
                                        name="email"
                                        prepend-icon="email"
                                        type="text"
                                        required
                                        :error-messages="emailErrors"
                                        @input="$v.credentials.email.$touch()"
                                        @blur="$v.credentials.email.$touch()"
                                        @keyup="clearServerErrors('email')"
                                    />

                                    <v-text-field
                                        v-model="credentials.password"
                                        id="password"
                                        label="Password"
                                        name="password"
                                        prepend-icon="lock"
                                        type="password"
                                        required
                                        :error-messages="passwordErrors"
                                        @input="$v.credentials.password.$touch()"
                                        @blur="$v.credentials.password.$touch()"
                                        @keyup="clearServerErrors('password')"
                                    />

                                    <v-alert
                                        :value="validationerror"
                                        color="error"
                                        v-html="error"
                                    >{{ errorMessage }}</v-alert>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    @click="register"
                                    :disabled="!isValid"
                                >Register</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import AuthService from '@/services/AuthService';
import { validationMixin } from 'vuelidate';
import {
    required,
    minLength,
    maxLength,
    email
} from 'vuelidate/lib/validators';

export default {
    mixins: [validationMixin],
    props: {
        source: String
    },
    validations: {
        credentials: {
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
            credentials: {
                name: '',
                surname: '',
                email: '',
                password: ''
            },
            serverErrors: {
                name: [],
                surname: [],
                email: [],
                password: []
            },
            errorMessage: '',
            error: null,
            validationerror: false,
            isValid: true
        };
    },
    computed: {
        nameErrors() {
            const errors = [];
            if (!this.$v.credentials.name.$dirty) return errors;
            (!this.$v.credentials.name.minLength ||
                !this.$v.credentials.name.maxLength) &&
                errors.push('Name must be 2-40 characters in length');
            !this.$v.credentials.name.required &&
                errors.push('Name is required');
            this.serverErrors.name.length &&
                this.serverErrors.name.forEach(err => errors.push(err));
            return errors;
        },
        surnameErrors() {
            const errors = [];
            if (!this.$v.credentials.surname.$dirty) return errors;
            (!this.$v.credentials.surname.minLength ||
                !this.$v.credentials.surname.maxLength) &&
                errors.push('Surname must be 2-40 characters in length');
            !this.$v.credentials.surname.required &&
                errors.push('Surname is required');
            this.serverErrors.surname.length &&
                this.serverErrors.surname.forEach(err => errors.push(err));
            return errors;
        },
        emailErrors() {
            const errors = [];
            if (!this.$v.credentials.email.$dirty) return errors;
            !this.$v.credentials.email.email &&
                errors.push('Must be valid e-mail');
            !this.$v.credentials.email.required &&
                errors.push('E-mail is required');
            this.serverErrors.email.length &&
                this.serverErrors.email.forEach(err => errors.push(err));
            return errors;
        },
        passwordErrors() {
            const errors = [];
            if (!this.$v.credentials.password.$dirty) return errors;
            (!this.$v.credentials.password.minLength ||
                !this.$v.credentials.password.maxLength) &&
                errors.push('Password must be 6-32 characters in length');
            !this.$v.credentials.password.required &&
                errors.push('Password is required');
            this.serverErrors.password.length &&
                this.serverErrors.password.forEach(err => errors.push(err));
            return errors;
        }
    },

    methods: {
        async register() {
            try {
                await AuthService.register(this.credentials);
                this.validationerror = false;
                this.$router.push('/login');
            } catch (error) {
                if (error.response.status === 400) {
                    error.response.data.errors.map(error => {
                        if (this.serverErrors[error.param]) {
                            this.serverErrors[error.param].push(error.message);
                        }
                    });
                }

                if (error.response.status === 401) {
                    this.errorMessage = 'Invalid credentials!';
                }
            }
        },
        clearServerErrors(type) {
            this.serverErrors[type] = [];
        }
    }
};
</script>
