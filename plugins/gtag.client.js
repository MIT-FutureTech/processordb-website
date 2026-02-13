export default defineNuxtPlugin({
  name: 'google-tag',
  mode: 'client',
  setup() {
    useHead({
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-H88YQHDYJ5',
          async: true
        },
        {
          innerHTML: 'window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag(\'js\', new Date()); gtag(\'config\', \'G-H88YQHDYJ5\');'
        }
      ]
    });
  }
});
