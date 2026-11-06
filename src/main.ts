import { createApp } from 'vue'
import { MotionPlugin } from 'motion-v'
import App from './App.vue'
import './styles/main.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
createApp(App).use(MotionPlugin).mount('#app')
