# 🤖 Nexus AI 助手

> 一个基于 Vue 3 + Node.js + 智谱 AI 的全栈智能对话应用，支持文本问答、文件解析、多模式处理与对话历史管理。

![Vue](https://img.shields.io/badge/Vue-3.x-4fc08d?logo=vue.js)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![智谱AI](https://img.shields.io/badge/智谱-GLM--4--Flash-0078D4)

---

## ✨ 功能亮点

- 💬 **智能对话**：接入智谱 AI `glm-4-flash` 模型，流式输出，响应快速。
- 📎 **文件解析**：支持上传 `.txt`、`.pdf`、`.docx`、`.xlsx` 等文件，自动提取文本内容作为对话上下文。
- 🌐 **三种模式**：**翻译**、**润色**、**回答**，一键切换，适配不同场景。
- 📜 **对话历史**：本地持久化存储（localStorage），支持新建、切换、删除对话，并自动生成标题。
- 🔐 **用户登录**：模拟手机号登录（演示用），登录后对话记录与账号绑定。
- 🎨 **赛博朋克 UI**：玻璃态毛玻璃效果、霓虹灯边框、动态光效，视觉沉浸。

---

## 🛠 技术栈

| 前端 | 后端 |
|------|------|
| Vue 3 (Composition API) | Node.js + Express |
| Vite | 智谱 AI API (GLM-4-Flash) |
| Element Plus | Multer (文件上传) |
| Pinia (状态管理) | pdf-parse / mammoth / xlsx (内容解析) |
| Vue Router | JWT (鉴权) |
| Axios | node-schedule (定时清理) |

---

## 🚀 在线体验

> 后端部署于 Render，前端部署于 Vercel。首次访问后端可能需等待 30-50 秒（免费实例休眠唤醒）。

- 🌍 前端地址：(https://my-nexus-ai.netlify.app/)
- 🔌 后端 API 地址：(https://nexus-ai-backend-production-3faf.up.railway.app/)

**测试账号**（手机号 / 密码）：
- `13300000000` / `123456`
- `13311111111` / `654321`

---

## 📦 本地运行

### 1. 克隆项目

```bash
git clone https://github.com/Valentina0325/nexus-ai-assistant.git
cd nexus-ai-assistant
