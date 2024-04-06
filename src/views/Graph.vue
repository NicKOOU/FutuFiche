<template>
    <v-card flat class="mt-4 mb-4">
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-file-document"></v-icon> &nbsp;
            Dashboard

            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Rechercher" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-container>
            <v-data-table v-model:search="search" :headers="headers" :items="fiches">
                <!-- En-têtes de colonnes -->
                <template v-slot:header="{ headers }">
                    <thead>
                        <tr>
                            <th v-for="header in headers" :key="header.text">
                                {{ header.text }}
                            </th>
                        </tr>
                    </thead>
                </template>

                <!-- Contenu de la table -->
                <template v-slot:item.period="{ item }">
                    <div>{{ item.period }}</div>
                </template>

                <template v-slot:item.netPay="{ item }">
                    <div>{{ item.netPay }}</div>
                </template>

                <template v-slot:item.employer="{ item }">
                    <div>{{ item.employer }}</div>
                </template>
            </v-data-table>
        </v-container>
    </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';

export default {
    name: 'FichePaieTable',
    setup() {
        const fiches = ref([]);
        const search = ref('');

        onMounted(async () => {
            const username = Cookies.get('username');
            if (!username) {
                console.log('User not logged in');
                return;
            }
            const response = await fetch('https://futuficheback.onrender.com/api/fiches/getFiches/' + username);
            const data = await response.json();
            fiches.value = data.fiches;
        });

        const headers = [
            { title: 'Période', align: 'start', sortable: true, value: 'period' },
            { title: 'Net Payé', value: 'netPay' },
            { title: 'Employeur', value: 'employer' },
        ];

        return {
            fiches,
            headers,
            search
        };
    },
};
</script>

<style scoped></style>
