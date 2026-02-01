import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import * as uniIcons from '@dcloudio/uni-ui/lib/icons'

// 导入全局样式
import './styles/global.css'

// 导入请求拦截器
import './utils/request'

// 导入uni-ui组件
import uniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue'
import uniButton from '@dcloudio/uni-ui/lib/uni-button/uni-button.vue'
import uniInput from '@dcloudio/uni-ui/lib/uni-input/uni-input.vue'
import uniList from '@dcloudio/uni-ui/lib/uni-list/uni-list.vue'
import uniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue'
import uniCard from '@dcloudio/uni-ui/lib/uni-card/uni-card.vue'
import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue'

// 创建应用实例
export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  
  // 注册Pinia
  app.use(pinia)
  
  // 注册全局组件
  app.component('uni-nav-bar', uniNavBar)
  app.component('uni-button', uniButton)
  app.component('uni-input', uniInput)
  app.component('uni-list', uniList)
  app.component('uni-list-item', uniListItem)
  app.component('uni-card', uniCard)
  app.component('uni-badge', uniBadge)
  
  // 注册全局图标
  app.config.globalProperties.$icons = uniIcons
  
  return {
    app
  }
}
