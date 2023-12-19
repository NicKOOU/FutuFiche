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
            <v-col v-for="fiche in fiches" :key="fiche.period + fiche.employer" cols="12" md="3">
                <v-card class="fiche-card">
                    <v-card-title class="fiche-header">{{ fiche.period }}</v-card-title>

                    <v-card-subtitle class="fiche-subtitle">{{ fiche.employer }}</v-card-subtitle>

                    <v-card-text class="fiche-net">NET {{ fiche.netPay }}</v-card-text>

                    <v-card-actions class="fiche-actions">
                        <v-btn @click="deleteFiche(fiche.period + fiche.employer)" text class="suppbut">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn @click="viewFiche(fiche.period + fiche.employer)" text class="addbut">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-row>

        <v-dialog v-model="ficheDialog" max-width="600px">
            <v-card>
                <v-card-title>Ajouter une fiche de paie</v-card-title>
                <v-card-text>
                    <v-file-input label="Fichier PDF ou image"></v-file-input>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="addFicheDialog = false">Annuler</v-btn>
                    <v-btn @click="addFicheToServer">Valider</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';



const ficheDialog = ref(false);
const fiches = ref([]);

const viewFiche = (ficheId) => {

};

const deleteFiche = (ficheId) => {
    fiches.value = fiches.value.filter(fiche => fiche.period + fiche.employer !== ficheId);
    const username = Cookies.get('username');
    if (!username) {
        console.log('User not logged in');
        return;
    }

    fetch('http://localhost:3000/api/fiches/deleteFiche/' + username + '/' + ficheId, {
        method: 'DELETE',
    }).then(response => {
        if (response.status === 200) {
            console.log('Fiche deleted');
        } else {
            console.log('Error deleting fiche');
        }
    });

};

const addFicheToServer = async () => {
    const file = document.querySelector('input[type=file]').files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
        const base64 = event.target.result;
        console.log(base64);

        try {

            const formData = new FormData();
            formData.append('base64Image', base64);
            formData.append('filetype', 'pdf');
            formData.append('isTable', true);
            formData.append('scale', true);
            formData.append('language', 'fre');

            const ocrData = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                headers: {
                    apikey: '',
                },
                body: formData,
            });

            const ocrDataJson = await ocrData.json();
            let lines = ocrDataJson.ParsedResults[0].ParsedText;
            lines = lines.replace(/•/g, '');
            console.log(lines);
            const extractValue = (text, keyword) => {
                const regex = new RegExp(`${keyword}\\s*:?\\s*([^\\n]+)`);
                const match = text.match(regex);

                if (match) {
                    let value = match[1].trim();
                    value = value.split('\t')[0];
                    return value;
                } else {
                    return null;
                }
            };

            const extractNumber = (text, keyword) => {
                const regex = new RegExp(`${keyword}\\s*:\\s*(\\d+)`);
                const match = text.match(regex);

                return match ? match[1].trim() : null;
            };

            const extractLastNumber = (text, keyword) => {
                const regex = new RegExp(`${keyword}\\s*:\\s*([0-9., ]+)`);
                const match = text.match(regex);

                if (match) {
                    let value = match[1].trim();

                    const parts = value.split(/\s+/);
                    const lastPart = parts[parts.length - 1];

                    const cleanedValue = lastPart.replace(/ /g, '').replace(/,/g, '.');

                    const floatValue = parseFloat(cleanedValue);

                    if (!isNaN(floatValue)) {
                        return floatValue;
                    }
                }

                return null;
            };

            const data = {
                employer: extractNumber(lines, 'Siret'),
                period: extractValue(lines, 'Période'),
                jobTitle: extractValue(lines, 'Emploi'),
                baseSalary: extractLastNumber(lines, 'Salaire de base'),
                totalNetSocial: extractLastNumber(lines, 'Total net social'),
                netToPayBeforeIncomeTax: extractLastNumber(lines, 'Net à payer avant impôt sur le revenu'),
                incomeTax: extractLastNumber(lines, 'Impôt sur le revenu prélevé à la source - PAS'),
                netPay: extractLastNumber(lines, 'Net payé'),
                leaveN: extractLastNumber(lines, 'Congés N'),
                leaveN1: extractLastNumber(lines, 'Congés N-1'),
                restaurantCoupons: extractNumber(lines, 'Tickets restaurant')
            };

            console.log(data);

        } catch (error) {
            console.error('Error adding fiche', error);
        }
    });
    reader.readAsDataURL(file);
};

const extractValue = (text, regex) => {
    const match = text.match(regex);
    if (match) {
        return match[1];
    }
    return '';
};

const addFiche = () => {
    ficheDialog.value = true;
};

onMounted(async () => {
    const username = Cookies.get('username');
    if (!username) {
        console.log('User not logged in');
        return;
    }
    const response = await fetch('http://localhost:3000/api/fiches/getFiches/' + username);
    response.json().then(data => {
        fiches.value = data.fiches;
    });
});
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