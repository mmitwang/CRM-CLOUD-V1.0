import { createApp } from 'vue'
import App from './App.vue'
import uniUi from '@dcloudio/uni-ui'

// 创建Vue应用
const app = createApp(App)

// 使用uni-ui组件库
app.use(uniUi)

// 挂载应用
app.mount('#app')
