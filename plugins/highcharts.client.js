import { defineNuxtPlugin } from '#app';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import Exporting from 'highcharts/modules/exporting';

export default defineNuxtPlugin({
    name: 'highcharts',
    mode: 'client', // Only run on client side to avoid SSR issues
    enforce: 'pre', // Ensure this plugin runs before other plugins
    setup(nuxtApp) {
        // Double-check we're on the client
        if (process.server) {
            return;
        }
        
        try {
            // Initialize Highcharts modules
            Exporting(Highcharts);

            // Register HighchartsVue with the Vue app and pass Highcharts instance
            nuxtApp.vueApp.use(HighchartsVue, { highcharts: Highcharts });

            // Make Highcharts available globally
            nuxtApp.provide('highcharts', Highcharts);
            
            // Verify component registration
            if (process.client) {
                console.log('Highcharts plugin loaded successfully');
            }
        } catch (error) {
            console.error('Highcharts plugin failed to load:', error);
        }
    }
});