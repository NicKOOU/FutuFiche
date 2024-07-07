<template>
    <div class="graphs-container">
        <!-- Graphiques de ligne pour l'évolution des revenus net, brut et de l'imposition -->
        <v-row justify="center" class="mb-4">
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Évolution du Revenu Net</v-card-title>
                    <v-card-text>
                        <apexchart type="line" :options="revenuNetOptions" :series="revenuNetSeries"></apexchart>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Évolution du Revenu Brut</v-card-title>
                    <v-card-text>
                        <apexchart type="line" :options="revenuBrutOptions" :series="revenuBrutSeries"></apexchart>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Évolution de l'Impôt</v-card-title>
                    <v-card-text>
                        <apexchart type="line" :options="impositionOptions" :series="impositionSeries"></apexchart>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Graphique en secteurs pour les différentes parts -->
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Parts des Revenus</v-card-title>
                    <v-card-text>
                        <apexchart type="pie" :options="partsOptions" :series="partsSeries"></apexchart>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';

export default {
    setup() {
        // Données pour les graphiques de ligne
        const revenuNetOptions = ref({
            // Options de configuration du graphique (surtout les axes X et Y)
            xaxis: {
                categories: [], // Vous pouvez remplir cette liste avec les périodes de vos fiches
            },
        });
        const revenuNetSeries = ref([{ name: 'Revenu Net', data: [] }]);

        const revenuBrutOptions = ref({
            // Options de configuration du graphique (surtout les axes X et Y)
            xaxis: {
                categories: [], // Vous pouvez remplir cette liste avec les périodes de vos fiches
            },
        });
        const revenuBrutSeries = ref([{ name: 'Revenu Brut', data: [] }]);

        const impositionOptions = ref({
            // Options de configuration du graphique (surtout les axes X et Y)
            xaxis: {
                categories: [], // Vous pouvez remplir cette liste avec les périodes de vos fiches
            },
        });
        const impositionSeries = ref([{ name: 'Imposition', data: [] }]);

        // Données pour le graphique en secteurs (part des revenus)
        const partsOptions = ref({
            // Options de configuration du graphique (notamment le titre)
            labels: ['Revenu Net', 'Impôt'], // Vous pouvez ajouter d'autres catégories si nécessaire
        });
        const partsSeries = ref([0, 0]); // Remplissez cette liste avec le montant total du revenu net et de l'impôt

        onMounted(async () => {
            // Récupérer les données de l'API
            const username = Cookies.get('username');
    if (!username) {
        console.log('User not logged in');
        return;
    }
            const response = await fetch('https://futuficheback.onrender.com/api/fiches/getFiches/' + username);
            const data = await response.json();

            // Mettre à jour les données des graphiques avec les données de l'API
            revenuNetOptions.value.xaxis.categories = data.fiches.map(fiche => fiche.period);
            revenuNetSeries.value[0].data = data.fiches.map(fiche => fiche.netPay);

            revenuBrutOptions.value.xaxis.categories = data.fiches.map(fiche => fiche.period);
            revenuBrutSeries.value[0].data = data.fiches.map(fiche => fiche.baseSalary);

            impositionOptions.value.xaxis.categories = data.fiches.map(fiche => fiche.period);
            impositionSeries.value[0].data = data.fiches.map(fiche => fiche.incomeTax);

            // Calculer la part des revenus net et de l'impôt
            const totalRevenuNet = data.fiches.reduce((acc, fiche) => acc + fiche.netPay, 0);
            const totalImpot = data.fiches.reduce((acc, fiche) => acc + fiche.incomeTax, 0);
            partsSeries.value = [totalRevenuNet, totalImpot];
        });

        return {
            revenuNetOptions,
            revenuNetSeries,
            revenuBrutOptions,
            revenuBrutSeries,
            impositionOptions,
            impositionSeries,
            partsOptions,
            partsSeries,
        };
    },
};
</script>

<style scoped>
.graphs-container {
    margin-top: 20px;
}

.mb-4 {
    margin-bottom: 20px;
}

.chart {
    margin-bottom: 20px;
}

.pie-chart {
    margin-top: 20px;
}
</style>
