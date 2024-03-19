<template>
    <v-container fluid>
        <alertComponent :message="message"></alertComponent>
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

        <template>
            <v-dialog v-model="ocrDialog" max-width="1300px">
                <v-card class="ocr-dialog">
                    <v-card-title class="headline">OCR AI</v-card-title>
                    <v-divider></v-divider>
                    <v-container>
                        <v-row>
                            <v-col cols="6">
                                <vue-pdf-embed :source="pdf" :page="1" :scale="1.5"></vue-pdf-embed>
                            </v-col>
                            <v-col cols="6">
                                <v-card>
                                    <v-card-title class="headline">Informations trouvées</v-card-title>
                                    <v-divider></v-divider>
                                    <v-form>
                                        <v-text-field v-model="employer" label="Employeur"></v-text-field>
                                        <v-text-field v-model="period" label="Période"></v-text-field>
                                        <v-text-field v-model="jobTitle" label="Emploi"></v-text-field>
                                        <v-text-field v-model="baseSalary" label="Salaire de base"></v-text-field>
                                        <v-text-field v-model="totalNetSocial" label="Total net social"></v-text-field>
                                        <v-text-field v-model="netToPayBeforeIncomeTax"
                                            label="Net à payer avant impôt sur le revenu"></v-text-field>
                                        <v-text-field v-model="incomeTax"
                                            label="Impôt sur le revenu prélevé à la source - PAS"></v-text-field>
                                        <v-text-field v-model="netPay" label="Net payé"></v-text-field>
                                        <v-text-field v-model="leaveN" label="Congés N"></v-text-field>
                                        <v-text-field v-model="leaveN1" label="Congés N-1"></v-text-field>
                                        <v-text-field v-model="restaurantCoupons"
                                            label="Tickets restaurant"></v-text-field>
                                    </v-form>
                                    <v-card-actions>
                                        <v-btn @click="ocrDialog = false">Annuler</v-btn>
                                        <v-btn @click="sendData()">Valider</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-dialog>
        </template>


    </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Cookies from 'js-cookie';
import VuePdfEmbed from 'vue-pdf-embed';
import alertComponent from '@/components/alert.vue';

const ficheDialog = ref(false);
const fiches = ref([]);
const ocrDialog = ref(false);
const pdf = ref(null);
const employer = ref('');
const period = ref('');
const jobTitle = ref('');
const baseSalary = ref('');
const totalNetSocial = ref('');
const netToPayBeforeIncomeTax = ref('');
const incomeTax = ref('');
const netPay = ref('');
const leaveN = ref('');
const leaveN1 = ref('');
const restaurantCoupons = ref('');
const message = ref('');
const viewFiche = (ficheId) => {

};

const deleteFiche = (ficheId) => {
    fiches.value = fiches.value.filter(fiche => fiche.period + fiche.employer !== ficheId);
    const username = Cookies.get('username');
    if (!username) {
        console.log('User not logged in');
        return;
    }

    fetch('https://futuficheback.onrender.com/api/fiches/' + username + '/' + ficheId, {
        method: 'DELETE',
    }).then(response => {
        if (response.status === 200) {
            console.log('Fiche deleted');
        } else {
            message.value = 'Erreur lors de la suppression de la fiche';
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
        pdf.value = base64;

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
                    apikey: import.meta.env.VITE_OCR_API_KEY
                },
                body: formData,
            });

            const ocrDataJson = await ocrData.json();
            let lines = ocrDataJson.ParsedResults[0].ParsedText;
            lines = lines.replace(/•/g, '');
            console.log(lines);

            function removeAccents(str) {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }

            function normalizeText(text) {
                return removeAccents(text.toLowerCase())
            }

            lines = normalizeText(lines);
            console.log(lines);


            const extractValue = (text, keyword) => {
                keyword = normalizeText(keyword);
                const regex = new RegExp(`${keyword}\\s*:?\\s*([^\\n]+)`);
                const match = text.match(regex);

                if (match) {
                    let value = match[1].trim();
                    value = value.split('\t')[0];
                    return value;
                } else {
                    return '';
                }
            };

            const extractNumber = (text, keyword) => {
                keyword = normalizeText(keyword);
                const regex = new RegExp(`${keyword}\\s*:\\s*(\\d+)`);
                const match = text.match(regex);

                return match ? match[1].trim() : '';
            };

            function extractLastNumber(texte, motCle) {
                motCle = normalizeText(motCle);
                console.log(texte);
                const regexMotCle = new RegExp(motCle, 'i');
                const matchMotCle = texte.match(regexMotCle);

                if (matchMotCle) {
                    const debutNombre = matchMotCle.index + matchMotCle[0].length;
                    const regexNombre = /\d+(\s\d+)?(\.\d+)?/;
                    const matchNombre = texte.slice(debutNombre).match(regexNombre);

                    if (matchNombre) {
                        const nombre = parseFloat(matchNombre[0].replace(/\s/g, '').replace(',', '.'));
                        return nombre;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }

            const data = {
                employer: extractNumber(lines, 'Siret'),
                period: extractValue(lines, 'Période'),
                jobTitle: extractValue(lines, 'Emploi'),
                baseSalary: extractLastNumber(lines, 'Salaire de base'),
                totalNetSocial: extractLastNumber(lines, 'Montant net social'),
                netToPayBeforeIncomeTax: extractLastNumber(lines, 'Net à payer avant impôt sur le revenu'),
                incomeTax: extractLastNumber(lines, 'Impôt sur le revenu prélevé à la source - PAS'),
                netPay: extractLastNumber(lines, 'Net payé'),
                leaveN: extractLastNumber(lines, 'Congés N'),
                leaveN1: extractLastNumber(lines, 'Congés N-1'),
                restaurantCoupons: extractLastNumber(lines, 'Titres-restaurant')
            };

            ocrData.value = data;
            employer.value = data.employer;
            period.value = data.period;
            jobTitle.value = data.jobTitle;
            baseSalary.value = data.baseSalary;
            totalNetSocial.value = data.totalNetSocial;
            netToPayBeforeIncomeTax.value = data.netToPayBeforeIncomeTax;
            incomeTax.value = data.incomeTax;
            netPay.value = data.netPay;
            leaveN.value = data.leaveN;
            leaveN1.value = data.leaveN1;
            restaurantCoupons.value = data.restaurantCoupons;
            ficheDialog.value = false;
            ocrDialog.value = true;

        } catch (error) {
            console.error('Error adding fiche', error);
        }
    });
    reader.readAsDataURL(file);
};

const addFiche = () => {
    ficheDialog.value = true;
};

const sendData = () => {
    const username = Cookies.get('username');
    if (!username) {
        console.log('User not logged in');
        return;
    }

    const data = {
        employer: employer.value,
        period: period.value,
        jobTitle: jobTitle.value,
        baseSalary: baseSalary.value,
        totalNetSocial: totalNetSocial.value,
        netToPayBeforeIncomeTax: netToPayBeforeIncomeTax.value,
        incomeTax: incomeTax.value,
        netPay: netPay.value,
        leaveN: leaveN.value,
        leaveN1: leaveN1.value,
        restaurantCoupons: restaurantCoupons.value,
        username: username,
    };

    fetch('https://futuficheback.onrender.com/api/fiches/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (response.status === 200) {
            console.log('Fiche added');
            delete data.username;
            fiches.value.push(data);
            ocrDialog.value = false;
            console.log(fiches.value);

        } else {
            message.value = 'Erreur lors de l\'ajout de la fiche';
            console.log('Error adding fiche');
        }
    });

    ocrDialog.value = false;
};

onMounted(async () => {
    const username = Cookies.get('username');
    if (!username) {
        console.log('User not logged in');
        return;
    }
    const response = await fetch('https://futuficheback.onrender.com/api/fiches/getFiches/' + username);
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

.ocr-dialog {
    background-color: #3498db;
}

.headline {
    background-color: #34495e;
    color: white;
}
</style>