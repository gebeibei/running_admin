import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ZrxAdminPlus from './zrxAdminPlus'
// import zrxChart from 'zrx-chart';
import 'uno.css'
import '@/assets/style/global.scss'
import at from 'array.prototype.at'

at.shim()
const pinia = createPinia()
const app = createApp(App)

app.use(ZrxAdminPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
