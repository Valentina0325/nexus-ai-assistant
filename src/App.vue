<script setup></script>
<template>
  <router-view />
</template>

<style>
  :root {
    --neon-blue: #00d4ff;
    --neon-purple: #a855f7;
    --neon-pink: #ff3b6f;
    --glass-bg: rgba(8, 12, 25, 0.65);
    --glass-border: rgba(0, 212, 255, 0.3);
    --card-shadow:
      0 25px 45px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 212, 255, 0.1) inset,
      0 0 20px rgba(0, 212, 255, 0.2);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: radial-gradient(circle at 20% 30%, #0a0f1e, #03050b);
    font-family:
      'Segoe UI',
      'Poppins',
      'Inter',
      'Microsoft YaHei',
      'PingFang SC',
      system-ui,
      -apple-system,
      'Roboto',
      monospace;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  /* 动态网格背景 */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* 漂浮光球 */
  body::after {
    content: '';
    position: fixed;
    top: -20%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle,
      rgba(0, 212, 255, 0.3),
      rgba(123, 44, 191, 0.2)
    );
    filter: blur(100px);
    border-radius: 50%;
    pointer-events: none;
    animation: floatGlow 12s infinite alternate ease-in-out;
    z-index: 0;
  }

  @keyframes floatGlow {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 0.5;
    }
    100% {
      transform: translate(-30px, 30px) scale(1.2);
      opacity: 0.8;
    }
  }

  /* 全局滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--neon-blue);
    border-radius: 10px;
    box-shadow: inset 0 0 3px #000;
  }

  .el-message {
    --el-message-bg-color: rgba(10, 20, 35, 0.9) !important;
    --el-message-border-color: var(--neon-blue) !important;
    backdrop-filter: blur(12px);
    border-radius: 40px;
  }
  .el-message__content {
    color: #e2f0ff;
  }

  .el-button--primary {
    background: linear-gradient(95deg, #0b2b44, #1b3b5c);
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.2s;
  }
  .el-button--primary:hover {
    transform: translateY(-2px);
    background: linear-gradient(95deg, #00a6d4, #2c5f8a);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
  }
  .el-button--primary:active {
    transform: translateY(1px);
  }
</style>
