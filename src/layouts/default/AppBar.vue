<template>
  <v-app-bar app light color="primary" image="@/assets/FutuFiche.svg">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="userLoggedIn"></v-app-bar-nav-icon>

    <!-- Avatar et Titre -->
    <v-avatar :tile="true">
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

    <v-btn v-if="userLoggedIn">
      <v-icon>mdi-account</v-icon>
      <span>{{ username }}</span>
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
      <v-list-item to="/ajouter-fiche" exact>
        <template v-slot:prepend>
          <v-icon>mdi-file-plus</v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Ajouter une fiche</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/stats" exact>
        <template v-slot:prepend>
          <v-icon>mdi-chart-bar</v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Graphiques et Statistiques</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/evolutions" exact>
        <template v-slot:prepend>
          <v-icon>mdi-trending-up</v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Évolutions</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/retraite" exact>
        <template v-slot:prepend>
          <v-icon>mdi-briefcase-account</v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Retraite</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- Ajoutez ceci à votre template -->
  <v-dialog v-model="loginDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <v-img src="@/assets/FutuFiche.svg" alt="FutuFiche logo" width="100" height="100" class="image-center"></v-img>
        <span class="headline">Se connecter</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="username" label="Nom d'utilisateur" outlined></v-text-field>
          <v-text-field v-model="password" label="Mot de passe" outlined type="password"></v-text-field>

          <v-btn type="submit" color="primary">Se connecter</v-btn>

          <v-progress-circular v-if="loading" indeterminate size="24" color="primary"></v-progress-circular>
        </v-form>
        <v-alert v-if="loginError" type="error">{{ loginError }}</v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>


  <v-dialog v-model="registerDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <v-img src="@/assets/FutuFiche.svg" alt="FutuFiche logo" width="100" height="100" class="image-center"></v-img>
        <span class="headline">S'inscrire</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field v-model="newUsername" label="Nom d'utilisateur" outlined></v-text-field>
          <v-text-field v-model="newEmail" label="Email" outlined></v-text-field>
          <v-text-field v-model="newPassword" label="Mot de passe" outlined type="password"></v-text-field>

          <v-btn type="submit" color="primary">S'inscrire</v-btn>

          <v-progress-circular v-if="loading" indeterminate size="24" color="primary"></v-progress-circular>
        </v-form>
        <v-alert v-if="registerError" type="error">{{ registerError }}</v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
const router = useRouter();

const drawer = ref(false);
const userLoggedIn = ref(false);
const loginDialog = ref(false);
const registerDialog = ref(false);
const username = ref('');
const email = ref('');  // Ajout de l'email
const password = ref('');
const newUsername = ref('');
const newEmail = ref('');  // Ajout de l'email pour l'inscription
const newPassword = ref('');
const loginError = ref(null);
const registerError = ref(null);
const loading = ref(false);

const login = async () => {
  try {
    loading.value = true; // Activer le chargement

    const response = await fetch('https://futuficheback.onrender.com/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      loginError.value = null;
      userLoggedIn.value = true;
      Cookies.set('userLoggedIn', 'true', { expires: 7 });
      Cookies.set('username', username.value, { expires: 7 });
      loginDialog.value = false;
      drawer.value = true;
    } else {
      loginError.value = 'Erreur lors de la connexion';
    }
  } catch (error) {
    loginError.value = 'Erreur lors de la connexion';
  } finally {
    loading.value = false; // Désactiver le chargement, que l'appel réussisse ou échoue
  }
};

const register = async () => {
  try {
    loading.value = true;

    const response = await fetch('https://futuficheback.onrender.com/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: newUsername.value,
        email: newEmail.value,
        password: newPassword.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      registerError.value = null;
      userLoggedIn.value = true;
      Cookies.remove('userLoggedIn');
      Cookies.remove('username');
      Cookies.set('userLoggedIn', 'true', { expires: 7 });
      Cookies.set('username', newUsername.value, { expires: 7 });
      checkLoggedInState();
      registerDialog.value = false;
      drawer.value = true;
    } else {
      registerError.value = 'Erreur lors de l\'inscription';
    }
  } catch (error) {
    registerError.value = 'Erreur lors de l\'inscription';
  } finally {
    loading.value = false;
  }
};


const logout = () => {
  userLoggedIn.value = false;
  username.value = '';
  password.value = '';
  Cookies.remove('userLoggedIn');
  Cookies.remove('username');
  router.push('/');
};

const openLoginDialog = () => {
  loginDialog.value = true
}

const openRegisterDialog = () => {
  registerDialog.value = true
}

const checkLoggedInState = () => {
  const storedState = Cookies.get('userLoggedIn');
  userLoggedIn.value = storedState === 'true';
  username.value = Cookies.get('username');

  if (!userLoggedIn.value) {
    router.push('/');
  }
};

onMounted(() => {
  checkLoggedInState();
});
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

.image-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.v-app-bar.custom-app-bar {
  background: url('@/assets/FutuFiche.svg') center center no-repeat;
  background-size: cover;
}
</style>
