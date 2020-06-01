<template>
    <v-app id="inspire">
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-toolbar-title>Login form</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn :href="source" icon large target="_blank" v-on="on"></v-btn>
                                    </template>
                                    <span>Source</span>
                                </v-tooltip>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field
                                        label="Login"
                                        name="login"
                                        prepend-icon="person"
                                        type="text"
                                        v-model="email"
                                    ></v-text-field>

                                    <v-text-field
                                        id="password"
                                        label="Password"
                                        name="password"
                                        prepend-icon="lock"
                                        type="password"
                                        v-model="password"
                                    ></v-text-field>
                                    <v-alert :value="validationerror" color="error" v-html="error"></v-alert>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="login">Login</v-btn>
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

export default {
    props: {
        source: String
    },

    data() {
        return {
            email: '',
            password: '',
            error: '',
            validationerror: false
        };
    },
    methods: {
        async login() {
            try {
                await AuthService.login({
                    email: this.email,
                    password: this.password
                });
                this.validationerror = false;
            } catch (error) {
                const { data } = error.response;

                if (data) {
                    this.error = data.error;
                    this.validationerror = true;
                }
            }
        }
    }
};
</script>