<template>
    <v-app id="inspire">
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-toolbar-title>Login Panel</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            :href="source"
                                            icon
                                            large
                                            target="_blank"
                                            v-on="on"
                                        ></v-btn>
                                    </template>
                                    <span>Source</span>
                                </v-tooltip>
                            </v-toolbar>
                            <v-card-text>
                                <v-form v-model="isValid">
                                    <v-alert
                                        text
                                        border="left"
                                        light
                                        color="red"
                                        type="error"
                                        v-if="errorMessage.length"
                                        >{{ errorMessage }}</v-alert
                                    >
                                    <v-text-field
                                        label="Email"
                                        name="email"
                                        prepend-icon="person"
                                        type="text"
                                        v-model="credentials.email"
                                        error-count="2"
                                        required
                                        :error-messages="emailErrors"
                                        @input="$v.credentials.email.$touch()"
                                        @blur="$v.credentials.email.$touch()"
                                        @keyup="clearServerErrors('login')"
                                    />

                                    <v-text-field
                                        id="password"
                                        label="Password"
                                        name="password"
                                        prepend-icon="lock"
                                        type="password"
                                        v-model="credentials.password"
                                        error-count="2"
                                        required
                                        v-on:keyup.enter="login"
                                        :error-messages="passwordErrors"
                                        @input="
                                            $v.credentials.password.$touch()
                                        "
                                        @blur="$v.credentials.password.$touch()"
                                        @keyup="clearServerErrors('password')"
                                    />
                                    <v-alert
                                        :value="validationerror"
                                        color="error"
                                        v-html="error"
                                    ></v-alert>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    :disabled="!isValid"
                                    @click="onLogin"
                                    >Login</v-btn
                                >
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
    required,
    minLength,
    maxLength,
    email
} from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import AuthService from '@/services/AuthService';

export default {
    props: {
        source: String
    },
    mixins: [validationMixin],

    validations: {
        credentials: {
            email: { required, email },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(50)
            }
        }
    },
    data() {
        return {
            credentials: {
                email: '',
                password: ''
            },
            serverErrors: {
                email: [],
                password: []
            },
            errorMessage: '',
            isValid: true,

            error: '',
            validationerror: false
        };
    },
    computed: {
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
        ...mapActions({
            login: 'login'
        }),

        async onLogin() {
            try {
                const { data } = await AuthService.login(this.credentials);
                this.login(data);
                this.$router.push('/user');
            } catch (error) {
                this.$notify({
                    group: 'msg',
                    type: 'error',
                    title: 'Sign in',
                    text: 'There were some problems ...'
                });

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
