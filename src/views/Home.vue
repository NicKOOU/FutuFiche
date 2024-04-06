<template>
  <v-container fluid class="home-container">
    <v-row :align="'center'">
      <v-col>
        <v-avatar size="200">
          <img src="@/assets/FutuFiche.svg" alt="FutuFiche logo" />
        </v-avatar>
      </v-col>
      <v-col>
        <v-row>
          <h1 class="font-weight-light">Futu</h1>
          <h1 class="font-weight-bold">Fiche</h1>
        </v-row>
        <v-row>
          <h2 class="font-weight-light">Pour une gestion sans tracas</h2>
        </v-row>
      </v-col>
      <v-col>
        <div class="author-info">
          <div>Nicolas Kourban</div>
          <div>Ingénieur Logiciel</div>
        </div>
      </v-col>
    </v-row>

    <v-row :align="'center'">
      <v-col>
        <h4 class="font-weight-light">
          Découvrez FutuFiche, votre compagnon numérique pour une gestion de carrière sans
          tracas. Simplifiez la gestion de vos fiches de paie, explorez des graphiques et statistiques détaillés, suivez
          vos évolutions professionnelles et planifiez votre retraite en toute sérénité. Avec une interface conviviale
          et des fonctionnalités intuitives, FutuFiche vous offre le pouvoir de prendre le contrôle de votre avenir
          professionnel. Connectez-vous dès maintenant et donnez vie à votre carrière avec FutuFiche !
        </h4>
      </v-col>
    </v-row>

    <v-divider class="my-9"></v-divider>

    <!-- Cartes de fonctionnalités -->
    <v-row justify="center" class="feature-cards">
      <v-col cols="12" md="3">
        <v-card class="elevation-5 mb-4">
          <v-img src="@/assets/fiche.svg" alt="Feature Image" height="200" class="image-with-background">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="white"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-title>Ajouter une fiche</v-card-title>
          <v-card-text>Simplifiez la gestion de vos fiches de paie en ajoutant facilement et rapidement des informations
            pertinentes.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="elevation-5 mb-4">
          <v-img src="@/assets/grapsh.svg" alt="Feature Image" height="200"></v-img>
          <v-card-title>Graphiques et Statistiques</v-card-title>
          <v-card-text>Explorez des graphiques et des statistiques détaillés pour visualiser et comprendre vos données
            financières de manière claire et informative.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="elevation-5 mb-4">
          <v-img src="@/assets/évolution.svg" alt="Feature Image" height="200"></v-img>
          <v-card-title>Évolutions</v-card-title>
          <v-card-text>Suivez vos évolutions professionnelles au fil du temps, comprenez vos succès et anticipez les
            opportunités futures.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="elevation-5 mb-4">
          <v-img src="@/assets/retraite.svg" alt="Feature Image" height="200"></v-img>
          <v-card-title>Retraite</v-card-title>
          <v-card-text>Planifiez votre retraite en toute sérénité grâce à des outils avancés qui vous aident à prendre
            des
            décisions éclairées sur votre avenir financier.</v-card-text>
        </v-card>
      </v-col>
    </v-row>




    <!-- Informations sur l'auteur -->
    <v-row :align="'center'" class="author-info">

    </v-row>


  </v-container>
</template>

<script setup>
import { ref } from 'vue';

</script>

<style scoped>
.home-container {
  text-align: center;
}

.feature-cards v-card {
  margin: 16px;
}

/* Ajustement pour centrer la description */
.home-container h4 {
  max-width: 800px;
  /* Ajustez la largeur selon vos besoins */
  margin: 0 auto;
}

.author-info {
  text-align: left;
  margin-top: 16px;
}
</style>
