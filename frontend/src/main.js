import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import socket from './plugins/socket';
import './styles/main.scss';

const app = createApp(App);
app.use(createPinia());
app.use(router);
if (localStorage.getItem('taskflow-token')) {
	socket.auth = { token: localStorage.getItem('taskflow-token') };
	socket.connect();
}
app.mount('#app');
