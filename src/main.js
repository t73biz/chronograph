import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
});

const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.mount('#app');
