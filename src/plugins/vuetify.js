/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import VueApexCharts from "vue3-apexcharts";
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#3498db',
          secondary: '#34495e',
        },
      },
    },
  },
  components: {
    "apexchart": VueApexCharts
  },

})
