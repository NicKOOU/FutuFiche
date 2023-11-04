<template>
  <v-app-bar app light color="primary">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="userLoggedIn"></v-app-bar-nav-icon>

    <!-- Avatar et Titre -->
    <v-avatar :tile="true" size="100">
      <img src="@/assets/FutuFiche.svg" alt="FutuFiche logo" />
    </v-avatar>
    <v-toolbar-title>
      <span class="font-weight-light">Futu</span>
      <span class="font-weight-bold">Fiche</span>
    </v-toolbar-title>

    <!-- Boutons de la barre d'application alignés à droite -->
    <v-btn v-if="!userLoggedIn" @click="openLoginDialog">
      <v-icon>mdi-account</v-icon>
      <span>Se connecter</span>
    </v-btn>

    <v-btn v-if="!userLoggedIn" @click="openRegisterDialog">
      <v-icon>mdi-account-plus</v-icon>
      <span>S'inscrire</span>
    </v-btn>

    <v-btn v-if="userLoggedIn" @click="logout">
      <v-icon>mdi-logout</v-icon>
      <span>Se déconnecter</span>
    </v-btn>

    <v-btn>
      <v-icon>mdi-lifebuoy</v-icon>
      <span>Support</span>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app v-if="userLoggedIn">
    <v-list>
      <v-list-item>
        <template v-slot:prepend>
          <v-list-item-avatar>
            <v-icon>mdi-file-plus</v-icon>
          </v-list-item-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title>Ajouter une fiche</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <template v-slot:prepend>
          <v-list-item-avatar>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title>Graphiques et Statistiques</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <template v-slot:prepend>
          <v-list-item-avatar>
            <v-icon>mdi-trending-up</v-icon>
          </v-list-item-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title>Évolutions</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <template v-slot:prepend>
          <v-list-item-avatar>
            <v-icon>mdi-briefcase-account</v-icon>
          </v-list-item-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title>Retraite</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-dialog v-model="loginDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Se connecter</span>
      </v-card-title>

      <v-card-text>
        <v-img src="@/assets/FutuFiche.svg" alt="FutuFiche logo" width="100" height="100"></v-img>
        <v-form @submit.prevent="login">
          <v-text-field v-model="username" label="Nom d'utilisateur" outlined></v-text-field>
          <v-text-field v-model="password" label="Mot de passe" outlined type="password"></v-text-field>

          <v-btn type="submit" color="primary">Se connecter</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="registerDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">S'inscrire</span>
      </v-card-title>

      <v-card-text>
        <v-img src="@/assets/FutuFiche.svg" alt="FutuFiche logo" width="100" height="100"></v-img>
        <v-form @submit.prevent="register">
          <v-text-field v-model="newUsername" label="Nom d'utilisateur" outlined></v-text-field>
          <v-text-field v-model="newPassword" label="Mot de passe" outlined type="password"></v-text-field>
          <!-- Ajoutez d'autres champs d'inscription si nécessaire -->

          <v-btn type="submit" color="primary">S'inscrire</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const userLoggedIn = ref(false)
const loginDialog = ref(false)
const registerDialog = ref(false)
const username = ref('')
const password = ref('')
const newUsername = ref('')
const newPassword = ref('')

const login = () => {
  // Logique de connexion
  userLoggedIn.value = true
  loginDialog.value = false
  drawer.value = true
}

const openLoginDialog = () => {
  loginDialog.value = true
}

const register = () => {
  // Logique d'inscription
  userLoggedIn.value = true
  registerDialog.value = false
  drawer.value = true
}

const openRegisterDialog = () => {
  registerDialog.value = true
}

const logout = () => {
  // Logique de déconnexion
  userLoggedIn.value = false
}
</script>

<style scoped>
.v-app-bar {
  height: 75px;
}

/* Style supplémentaire pour les icônes dans les boutons de la barre d'application */
.v-btn .v-icon {
  margin-right: 4px;
  /* Espace entre l'icône et le texte */
}
</style>