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
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="selectedItem.startDate"
                                    label="Start Contract"
                                    name="name"
                                    prepend-icon="person"
                                    placeholder="YYYY-MM-DD"
                                    type="text"
                                    required
                                    :rules="nameErrors"
                                    @input="$v.selectedItem.startDate.$touch()"
                                    @blur="$v.selectedItem.startDate.$touch()"
                                    @keyup="clearServerErrors('name')"
                                />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="selectedItem.duration"
                                    :items="[1, 2, 3, 6, 12]"
                                    label="Duration Contract."
                                    required
                                    :rules="durationTime"
                                    @input="$v.selectedItem.duration.$touch()"
                                    @blur="$v.selectedItem.duration.$touch()"
                                    @keyup="clearServerErrors('name')"
                                />
                            </v-col>

                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="selectedItem.leave"
                                    :items="[20, 26]"
                                    label="Days off"
                                    required
                                    :rules="leaveTime"
                                    @input="$v.selectedItem.leave.$touch()"
                                    @blur="$v.selectedItem.leave.$touch()"
                                    @keyup="clearServerErrors('name')"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="onSave" :disabled="!isValid">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-toolbar>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import UserContractsService from '../services/UserContractsService';
import { mapActions } from 'vuex';

import moment from 'moment';

export default {
    mixins: [validationMixin],

    props: {
        isOpen: Boolean,
        selectedObject: {
            Object,
            default: () => ({})
        },
        arrContracts: Array
    },

    validations: {
        selectedItem: {
            startDate: {
                required,
                isStartDate(value) {
                    return this.isStartDate(value);
                }
            },
            duration: {
                required
            },
            leave: {
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

        contracts: {
            get() {
                return this.arrContracts;
            },

            set(newValue) {
                this.$emit('update:arrContracts', newValue);
            }
        },

        formTitle() {
            return this.selectedItem.id ? 'Edit Contract' : 'New Contract';
        },

        nameErrors() {
            const errors = [];

            if (!this.$v.selectedItem.startDate.$dirty) return errors;
            !this.$v.selectedItem.startDate.required && errors.push('Date is required');
            !this.$v.selectedItem.startDate.isStartDate && errors.push('Enter valid date');

            return errors;
        },

        durationTime() {
            const errors = [];

            if (!this.$v.selectedItem.duration.$dirty) return errors;
            !this.$v.selectedItem.duration.required && errors.push('Duration is required');

            return errors;
        },

        leaveTime() {
            const errors = [];

            if (!this.$v.selectedItem.leave.$dirty) return errors;
            !this.$v.selectedItem.leave.required && errors.push('Day off required');

            return errors;
        },

        isValid() {
            return !this.$v.$invalid;
        }
    },

    methods: {
        ...mapActions({
            saveContract: 'contracts/saveContract'
        }),

        close() {
            this.open = false;
            this.selectedItem = { ...this.defaultItem };
            this.$v.$reset();
        },

        async onSave() {
            this.selectedItem.userId = this.$route.params.id;
            this.saveContract(this.selectedItem);

            this.close();
        },

        clearServerErrors(type) {
            this.serverErrors[type] = [];
        },

        async isStartDate(value) {
            if (!this.selectedItem.id) {
                const { id } = this.$route.params;
                const { data } = await UserContractsService.index(id);

                for (let i = 0; i < data.length; i++) {
                    if (
                        moment(value).isBetween(
                            data[i].startDate,
                            moment(data[i].startDate, 'YYYY-MM-DD').add(data[i].leave, 'days').format('YYYY-MM-DD'),
                            '[]'
                        )
                    ) {
                        return false;
                    }
                }
            }
            return moment(value, 'YYYY-MM-DD', true).isValid();
        }
    }
};
</script>
