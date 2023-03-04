import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Collapse } from 'vue-collapsed';
import icons from './icons';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

library.add(icons);
const pinia = createPinia();

createApp(App)
  .use(pinia)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('Collapse', Collapse)
  .mount('#app');
