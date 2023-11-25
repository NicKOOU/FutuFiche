<template>
    <v-container fluid>
        <v-row justify="center" align="center">
            <v-col cols="12" md="3">
                <v-card @click="addFiche" class="add-card">
                    <v-spacer></v-spacer>
                    <v-icon class="add-icon">mdi-plus</v-icon>
                    <v-card-text class="add-text">Ajouter une fiche</v-card-text>
                </v-card>
            </v-col>
            <v-col v-for="fiche in fiches" :key="fiche.id" cols="12" md="3">
                <v-card class="fiche-card">
                    <v-card-title class="fiche-header">{{ fiche.monthYear }}</v-card-title>

                    <v-card-subtitle class="fiche-subtitle">{{ fiche.companyName }}</v-card-subtitle>

                    <v-card-text class="fiche-net">NET {{ fiche.netAmount }}</v-card-text>

                    <v-card-actions class="fiche-actions">
                        <v-btn @click="deleteFiche(fiche.id)" text class="suppbut">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn @click="viewFiche(fiche.id)" text class="addbut">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>
<script setup>
import { ref } from 'vue';

const fiches = ref([
    { id: 1, monthYear: 'Février 2022', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 2, monthYear: 'Janvier 2022', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 3, monthYear: 'Décembre 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 4, monthYear: 'Novembre 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 5, monthYear: 'Octobre 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 6, monthYear: 'Septembre 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 7, monthYear: 'Août 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 8, monthYear: 'Juillet 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 9, monthYear: 'Juin 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 10, monthYear: 'Mai 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 11, monthYear: 'Avril 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 12, monthYear: 'Mars 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 13, monthYear: 'Février 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 14, monthYear: 'Janvier 2021', companyName: 'SALYTECH', netAmount: '1 500 €' },
    { id: 15, monthYear: 'Décembre 2020', companyName: 'SALYTECH', netAmount: '1 500 €' },
]);

const viewFiche = (ficheId) => {
    console.log('Visualiser la fiche de paie avec l\'ID:', ficheId);
};

const deleteFiche = (ficheId) => {
    console.log('Supprimer la fiche de paie avec l\'ID:', ficheId);
};

const addFiche = () => {
    console.log('Ajouter une nouvelle fiche de paie');
};
</script>

<style scoped>
.fiche-card {
    margin: 20px;
    border-radius: 15px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    background-color: #ffffff;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fiche-header {
    font-size: 20px;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 10px;
}

.add-card {
    background-color: #3498db;
    color: white;
    cursor: pointer;
    text-align: center;
    border-radius: 15px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* Ajout de cette ligne pour centrer verticalement */
    max-width: 300px;
    margin: 20px;
}

.fiche-subtitle {
    font-size: 16px;
    color: #757575;
    margin-bottom: 5px;
}

.fiche-net {
    font-size: 18px;
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 15px;
}

.fiche-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}


.add-icon {
    font-size: 36px;
    color: #34495e
}

.add-text {
    font-size: 18px;
    color: #34495e
}

.addbut,
.suppbut {
    /* Force la largeur à 100% pour garantir la même taille */
    color: #3498db;
    /* Couleur du texte */
}

.suppbut {
    color: #f44336;
    /* Couleur du texte */
}
</style>