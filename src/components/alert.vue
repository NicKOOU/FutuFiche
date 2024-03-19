<template>
    <v-alert v-model="showAlert" closable icon="$vuetify" :type="alertType">{{ message }}</v-alert>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            inputText: '',
            showAlert: false,
            alertType: ''
        };
    },
    methods: {
        showAlertWithTimer() {
            this.alertType = 'error';
            this.showAlert = true;
            setTimeout(() => {
                this.showAlert = false;
                this.inputText = ''; // Clear input after alert is closed
            }, 5000); // Adjust the time as needed (5000 milliseconds = 5 seconds)
        }
    },
    watch: {
        message() {
            if (this.message !== '') {
                this.showAlertWithTimer();
            }
        }
    }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
