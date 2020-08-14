
<template v-slot:top>
    <v-toolbar flat color="white">
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
                                    v-model="selectedItem.start"
                                    label="Start Leave"
                                    name="name"
                                    prepend-icon="person"
                                    placeholder="YYYY-MM-DD"
                                    type="text"
                                    required
                                    :rules="nameErrors"
                                    @input="$v.selectedItem.start.$touch()"
                                    @blur="$v.selectedItem.start.$touch()"
                                    @keyup="clearServerErrors('name')"
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="400">
                                <v-text-field
                                    v-model="selectedItem.end"
                                    label="End Leave"
                                    name="surname"
                                    placeholder="YYYY-MM-DD"
                                    prepend-icon="person"
                                    type="text"
                                    required
                                    :rules="surnameErrors"
                                    @input="$v.selectedItem.end.$touch()"
                                    @blur="$v.selectedItem.end.$touch()"
                                    @keyup="clearServerErrors('surname')"
                                />
                            </v-col>

                            <v-switch v-if="isBoardAdmin" v-model="selectedItem.approved" />

                            <v-alert
                                :value="validationerror"
                                color="error"
                                v-html="error"
                            >{{ errorMessage }}</v-alert>
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
    </v-toolbar>
</template>


<script>
import LeaveService from '../services/LeaveService.js';
import { mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';
import UserLeavesService from '../services/UserLeavesService.js';

export default {
    name: 'Leave',

    mixins: [validationMixin],

    props: {
        isOpen: Boolean,
        selectedObject: {
            Object,
            default: () => {
                return {};
            }
        },
        isLeaves: Array
    },

    validations: {
        selectedItem: {
            start: {
                required,
                isStartDate(value) {
                    return this.isStartDate(value);
                }
            },
            end: {
                required,
                isEndDate(value) {
                    return this.isEndDate(value);
                }
            }
        }
    },
    data() {
        return {
            serverErrors: {
                start: '',
                end: '',
                leaveDays: ''
            },
            validationerror: false,
            error: null,
            errorMessage: ''
        };
    },

    computed: {
        ...mapGetters({
            isAuthenticated: 'isAuthenticated',
            isAdmin: 'isAdmin',
            isUser: 'isUser',
            currentUser: 'getUser'
        }),
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

        leaves: {
            get() {
                return this.isLeaves;
            },

            set(newValue) {
                this.$emit('update:isLeaves', newValue);
            }
        },
        formTitle() {
            return this.selectedItem.id ? 'Edit Leave' : 'New Leave';
        },
        nameErrors() {
            const errors = [];
            if (!this.$v.selectedItem.start.$dirty) return errors;

            !this.$v.selectedItem.start.required && errors.push('Date is required');
            !this.$v.selectedItem.start.isStartDate && errors.push('Enter valid date');

            return errors;
        },
        surnameErrors() {
            const errors = [];

            if (!this.$v.selectedItem.end.$dirty) return errors;

            !this.$v.selectedItem.end.required && errors.push('Date is required');
            !this.$v.selectedItem.end.isEndDate && errors.push('Enter valid date');

            return errors;
        },
        isValid() {
            return !this.$v.$invalid;
        },
        isBoardAdmin() {
            return this.currentUser && this.isAdmin;
        }
    },

    methods: {
        async isStartDate(value) {
            if (!this.selectedItem.id) {
                const { userId } = this.$route.params;
                const { data } = await UserLeavesService.index(userId);

                for (let i = 0; i < data.length; i++) {
                    if (moment(value).isBetween(data[i].start, data[i].end, '[]')) {
                        return false;
                    }
                }
            }
            return moment(value, 'YYYY-MM-DD', true).isValid();
        },

        async isEndDate(value) {
            if (!this.selectedItem.id) {
                const { userId } = this.$route.params;
                const { data } = await UserLeavesService.index(userId);

                for (let i = 0; i < data.length; i++) {
                    if (moment(value).isBetween(data[i].start, data[i].end, '[]')) {
                        return false;
                    }
                }
            }
            return moment(value, 'YYYY-MM-DD', true).isValid();
        },

        clearServerErrors(type) {
            this.serverErrors[type] = [];
        },
        // isBoardAdmin() {
        //     return this.currentUser && this.isAdmin;
        // },
        close() {
            this.open = false;
            this.selectedItem = { ...this.defaultItem };
        },

        async onSave() {
            if (this.selectedItem.id) {
                const index = this.leaves.findIndex((contract) => contract.id === this.selectedItem.id);

                const { data } = await LeaveService.save(this.selectedItem);

                this.leaves.splice(index, 1, data);
            } else {
                this.selectedItem.userId = this.$route.params.userId;

                const { data } = await LeaveService.save(this.selectedItem);

                this.leaves.push(data);
            }

            this.close();
        },

        checkDate() {
            const errors = [];
            if (!this.$v.selectedItem.start.$dirty) return errors;

            !this.$v.selectedItem.start.required && errors.push('Date is required');
            !this.$v.selectedItem.start.isStartDate && errors.push('Enter valid date');

            return errors;
        }
    }
};
</script>
