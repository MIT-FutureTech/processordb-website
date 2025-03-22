import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(async (nuxtApp) => { 
    const [{ default: Highcharts }, { default: HighchartsVue }] = await Promise.all([ import('highcharts'), import('highcharts-vue') ]);
    const { default: Exporting } = await import('highcharts/modules/exporting');
    Exporting(Highcharts);

    nuxtApp.vueApp.use(HighchartsVue);
});