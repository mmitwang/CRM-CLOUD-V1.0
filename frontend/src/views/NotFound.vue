<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>页面不存在</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.not-found-content {
  text-align: center;
  padding: 60px 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 20px;
  line-height: 1;
}

.not-found-content h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}

.not-found-content p {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}

@media screen and (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }
  
  .not-found-content {
    padding: 40px 20px;
  }
  
  .not-found-content h1 {
    font-size: 20px;
  }
  
  .not-found-content p {
    font-size: 14px;
  }
}
</style>