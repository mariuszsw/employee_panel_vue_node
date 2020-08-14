<template>
    <div>
        <v-dialog v-model="open" max-width="500px">
            <v-card>
                <v-card-title>Remove</v-card-title>
                <v-card-text>Are you sure to delete?</v-card-text>
                <v-card-actions>
                    <v-btn color="primary" text @click="$emit('closeDialog')">Close</v-btn>
                    <v-btn color="primary" text @click="$emit('confirmDelete')">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'confirmDelete',
    props: {
        isOpen: Boolean
    },

    computed: {
        open: {
            get () {
                return this.isOpen;
            },

            set (newValue) {
                this.$emit('update:isOpen', newValue);
            }
        }
    }
};
</script>




