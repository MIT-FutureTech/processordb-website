import { defineNuxtPlugin } from '#app';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';

export default defineNuxtPlugin({
   name: 'highcharts-vue',
   parallel: true,
   setup (nuxtApp) {
       nuxtApp.vueApp.use(HighchartsVue);
   }
});