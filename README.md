# 🤖 Nexus AI 助手 · 前端

> 一个基于 Vue 3 + Node.js + 智谱 AI 的全栈智能对话应用，支持文本问答、文件解析、多模式处理与对话历史管理。

![Vue](https://img.shields.io/badge/Vue-3.x-4fc08d?logo=vue.js)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![智谱AI](https://img.shields.io/badge/智谱-GLM--4--Flash-0078D4)
[![Netlify](https://img.shields.io/badge/Netlify-在线预览-00d4ff?style=flat-square&logo=netlify)](https://my-nexus-ai.netlify.app)


---

## ✨ 功能亮点

- 🤖 **智能对话** – 接入智谱 AI GLM-4-Flash，流式输出，响应极快  
- 📎 **文件解析** – 支持 `.txt` / `.pdf` / `.docx` / `.xlsx`，自动提取文本作为上下文  
- 🎛️ **三种模式** – 翻译 · 润色 · 回答，一键切换  
- 📜 **对话历史** – 本地持久化存储，新建 / 切换 / 删除对话，自动生成标题  
- 👤 **用户登录** – 模拟手机号登录，对话与账号绑定  
- 🌌 **赛博朋克 UI** – 玻璃态毛玻璃，霓虹光效，动态背景  

---

## 🌐 在线体验

**前端地址**：[https://my-nexus-ai.netlify.app](https://my-nexus-ai.netlify.app)  

测试账号（手机号 / 密码）：
- `13300000000` / `123456`
- `13311111111` / `654321`

> 后端服务部署在 Railway，首次访问需等待 30-50 秒唤醒。

---

## 🚀 本地运行

### 环境要求
- Node.js **18+**
- npm 或 yarn

### 步骤

```bash
# 1. 克隆项目
git clone https://github.com/Valentina0325/nexus-ai-assistant.git
cd nexus-ai-assistant

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4.生产打包
npm run build

```
## 🛠️ 技术栈
| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 + Vite |
| UI 组件 | Element Plus |
| 状态管理 | Pinia（持久化） |
| 路由 | Vue Router |
| HTTP | Axios |
| Markdown | marked |

## 🔗 后端仓库
`后端代码独立维护，提供登录、文件上传、AI 对话等 API。`
👉 [https://github.com/Valentina0325/nexus-ai-backend](https://github.com/Valentina0325/nexus-ai-backend)


