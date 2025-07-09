<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 响应式变量
const writingTheme = ref(''); 
const originalText = ref('公司无故把我辞退了，一分钱都不给我。'); 
const polishedText = ref(''); 
const framework = ref(''); 
const keywords = ref(''); 
const isLoading = ref(false); 
const isFrameworkLoading = ref(false); 
const errorMessage = ref(''); 
const frameworkError = ref(''); 

// 案例网站列表
const referenceSites = ref([
  { name: '中国裁判文书网', url: 'https://wenshu.court.gov.cn/' },
  { name: '中国庭审公开网', url: 'https://tingshen.court.gov.cn/' },
  { name: '中国执行信息公开网', url: 'https://zxgk.court.gov.cn/' },
  { name: '中国仲裁网', url: 'https://www.china-arbitration.com/' },
  { name: '12309中国检察网', url: 'https://www.12309.gov.cn/' },
  { name: '人民法院公告网', url: 'https://rmfygg.court.gov.cn/' }
]);

// 生成写作框架
const handleFramework = async () => {
  if (!writingTheme.value.trim()) {
    frameworkError.value = '请输入写作主题';
    return;
  }
  
  isFrameworkLoading.value = true;
  framework.value = '';
  keywords.value = '';
  frameworkError.value = '';
  
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';
    const frameworkUrl = `${baseUrl}/api/framework`;
    const response = await axios.post(frameworkUrl, { topic: writingTheme.value});
    framework.value = response.data.framework;
    keywords.value = response.data.keywords || '';
  } catch (error) {
    console.error('请求写作框架API失败:', error);
    frameworkError.value = '生成写作框架失败，请稍后再试';
  } finally {
    isFrameworkLoading.value = false;
  }
};

// 润色文本
const handlePolish = async () => {
  if (!originalText.value.trim()) {
    errorMessage.value = '请输入需要润色的内容';
    return;
  }
  
  isLoading.value = true;
  polishedText.value = '';
  errorMessage.value = '';
  
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';
    const url = `${baseUrl}/api/polish`;
    const response = await axios.post(url, {
      originalText: originalText.value,
    });
    polishedText.value = response.data.polishedText;
  } catch (error) {
    console.error('请求后端失败:', error);
    errorMessage.value = '润色失败，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="main-container">
    <div class="left">
      <div class="header-section">
        <h1>法学实务写作助手</h1>
        <p class="subtitle">专业法律文书写作与润色工具</p>
      </div>
      <div class="left-panel">
        <div class="section">
          <h2>输入写作主题</h2>
          <textarea 
            v-model="writingTheme" 
            placeholder="例如：劳动合同纠纷起诉书"
            style="min-height: 80px; max-height: 120px;"
          ></textarea>
          <button 
            @click="handleFramework" 
            :disabled="isFrameworkLoading"
            class="framework-btn"
          >
            <span v-if="isFrameworkLoading" class="btn-loader"></span>
            {{ isFrameworkLoading ? '生成中...' : '生成写作框架' }}
          </button>
        </div>
        
        <!-- 关键词文本框 -->
        <div class="section" v-if="keywords">
          <h2>关键词</h2>
          <div class="result-box">
            <textarea 
    readonly 
    v-model="keywords" 
     class="readonly-textarea"
     style="min-height: 80px; max-height: 120px;"
     :placeholder="keywords ? '' : '关键词将显示在这里'"
   ></textarea>
          </div>
        </div>
        
        <!-- 写作框架文本框 -->
        <div class="section">
  <h2>写作框架</h2>
  <div v-if="frameworkError" class="error-message">{{ frameworkError }}</div>
  <div v-if="isFrameworkLoading" class="loading-spinner"></div>
  <div v-else class="result-box framework-box">
    <!-- 使用 v-if 替代 :placeholder -->
    <textarea 
      readonly 
      v-model="framework" 
      class="readonly-textarea"
      style="min-height: 300px;"
      v-if="framework"
    ></textarea>
    <div v-else class="placeholder-result">
      <div class="placeholder-icon">📝</div>
      <p>写作框架将显示在这里</p>
    </div>
  </div>
  </div>
   </div>
    </div>
    <div class="right">
      <div class="right-panel">
        <div class="section reference-section">
          <h2>案例参考网站</h2>
          <div class="reference-sites">
            <ul>
              <li v-for="(site, index) in referenceSites" :key="index">
                <a :href="site.url" target="_blank">
                  <span class="site-icon">📚</span>
                  <span class="site-name">{{ site.name }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="text-polishing-section">
          <!-- 左侧原文输入 -->
          <div class="polishing-input section">
            <h2>输入原文</h2>
            <textarea 
              v-model="originalText" 
              placeholder="在此输入需要润色的法律文书...(文本框可下拉)"
            ></textarea>
            <button 
              @click="handlePolish" 
              :disabled="isLoading"
              class="polish-btn"
            >
              <span v-if="isLoading" class="btn-loader"></span>
              {{ isLoading ? '润色中...' : '一键润色' }}
            </button>
          </div>
          
          <!-- 右侧润色结果 -->
          <div class="polishing-result section">
            <h2>润色结果</h2>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="isLoading" class="loading-spinner"></div>
            <div v-if="polishedText" class="result-box">
              <textarea readonly v-model="polishedText" class="readonly-textarea"></textarea>
            </div>
            <div v-else class="placeholder-result">
              <div class="placeholder-icon">✍️</div>
              <p>润色结果将显示在这里</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  /* 主要颜色变量 */
  --primary-color: #2c5e9e;
  --primary-light: #3a7cbe;
  --secondary-color: #3a7c47;
  --secondary-light: #4a9c57;
  --text-color: #34495e;
  --text-light: #7f8c8d;
  --background: #f5f7fa;
  --card-bg: #ffffff;
  --card-border: #e0e7ee;
  --card-shadow: 0 4px 16px rgba(44, 62, 80, 0.08);
  --success-color: #27ae60;
  --error-color: #e74c3c;
  --warning-color: #f39c12;
  
  /* 按钮颜色 */
  --framework-btn-bgColor: var(--primary-color);
  --framework-btn-hover-bgColor: var(--primary-light);
  --polish-btn-bgColor: var(--secondary-color);
  --polish-btn-hover-bgColor: var(--secondary-light);
  
  /* 尺寸变量 */
  --main-width: 90%;
  --border-radius: 10px;
  --transition: all 0.3s ease;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1a202c;
    --card-bg: #2d3748;
    --card-border: #4a5568;
    --text-color: #e2e8f0;
    --text-light: #a0aec0;
    --card-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
}
</style>

<style scoped>
/* ============ 全局样式重置 ============ */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
  width: 100%;
}
/* ============ 主容器布局 ============ */
.main-container {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 30px;
  flex: 1; /* 关键：占据剩余空间 */
  padding: 20px;
  box-sizing: border-box;
  box-shadow: none;
  border-radius: var(--border-radius);
  background-color: var(--background);
}
.app-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: var(--background);
  display: flex;
  flex-direction: column;
}
.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 35%;
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 65%;
  overflow: auto; /* 添加滚动以防内容过多 */
}

.header-section {
  text-align: center;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: var(--border-radius);
  background: linear-gradient(135deg, var(--primary-color), #1a3c6c);
  color: white;
}

h1 {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
}

/* ============ 通用区块样式 ============ */
.section {
  background: var(--card-bg);
  padding: 25px;
  border-radius: var(--border-radius);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  margin-bottom: 25px;
  transition: var(--transition);
}

.section:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(44, 62, 80, 0.15);
}

h2 {
  font-size: 18px;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--card-border);
  display: flex;
  align-items: center;
}

h2::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 18px;
  background: var(--primary-color);
  margin-right: 10px;
  border-radius: 2px;
}

/* ============ 文本区域样式 ============ */
textarea {
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 1px solid #dce4ec;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  transition: var(--transition);
  background: #f9fbfd;
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(44, 94, 158, 0.1);
}

.readonly-textarea {
  background: #f9fbfd;
  border: 1px solid #eaeef3;
  cursor: default;
}

/* ============ 按钮样式 ============ */
button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.framework-btn {
  background: var(--framework-btn-bgColor);
}

.framework-btn:not(:disabled):hover {
  background: var(--framework-btn-hover-bgColor);
}

.polish-btn {
  background: var(--polish-btn-bgColor);
}

.polish-btn:not(:disabled):hover {
  background: var(--polish-btn-hover-bgColor);
}

.btn-loader {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid white;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

/* ============ 结果区域样式 ============ */
.result-box {
  margin-top: 15px;
}

.framework-box {
  min-height: 300px;
  max-height: 400px;
}

/* ============ 参考网站样式 ============ */
.reference-section {
  background: linear-gradient(135deg, #f0f7ff, #e6f3ff);
  border: 1px solid #d0e3ff;
}

.reference-sites ul {
  padding-left: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.reference-sites li {
  padding: 3px 0;
}

.reference-sites a {
  display: flex;
  align-items: center;
  padding: 3px 15px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
  font-weight: 500;
  border: 1px solid #d0e3ff;
}

.reference-sites a:hover {
  background: white;
  transform: translateX(5px);
  box-shadow: 0 4px 10px rgba(44, 94, 158, 0.15);
}

.site-icon {
  font-size: 18px;
  margin-right: 10px;
}

/* ============ 润色区域样式 ============ */
.text-polishing-section {
  display: flex;
  gap: 25px;
  flex: 1; /* 新增 */
  min-height: 800px; /* 新增 */
}

.polishing-input, .polishing-result {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 250px !important; /* 加大最小高度 */
 padding: 20px; /* 增加内边距 */
 margin-bottom: 15px; /* 增加下边距 */
}

.placeholder-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: var(--text-light);
  border: 2px dashed #e0e7ee;
  border-radius: 8px;
  padding: 30px;
  margin-top: 15px;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

/* ============ 错误消息样式 ============ */
.error-message {
  border-radius: 8px;
  padding: 12px 15px;
  color: white;
  background-color: var(--error-color);
  margin-top: 15px;
  font-size: 14px;
}

/* ============ 加载动画 ============ */
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 30px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ============ 响应式设计 ============ */
@media screen and (max-width: 1200px) {
  .main-container {
    flex-direction: column;
    min-width: 90%;
    max-width: 100%;
    padding: 20px;
  }
  
  .left, .right {
    max-width: 100%;
    width: 100%;
  }
  
  .text-polishing-section {
    flex-direction: column;
  }
  
  .header-section {
    margin-bottom: 20px;
  }
}

@media screen and (max-width: 768px) {
  .reference-sites ul {
    grid-template-columns: 1fr;
  }
  
  .main-container {
    min-width: 95%;
    padding: 15px;
  }
  
  h1 {
    font-size: 24px;
  }
}
</style>
