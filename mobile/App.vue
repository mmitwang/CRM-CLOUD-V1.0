<template>
  <view class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </view>
</template>

<script setup>
// App组件逻辑
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 应用根容器 */
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 通用样式 */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.p-10 {
  padding: 10px;
}

.p-20 {
  padding: 20px;
}

/* 卡片样式 */
.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 按钮样式 */
.btn-primary {
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #e6f7ff;
  border-color: #1890ff;
}

/* 输入框样式 */
.input {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s;
}

.input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* 错误提示 */
.error {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 8px;
}

/* 成功提示 */
.success {
  color: #52c41a;
  font-size: 14px;
  margin-top: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .card {
    margin: 12px;
    padding: 16px;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .input {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
