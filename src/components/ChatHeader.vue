<template>
  <div class="title-section">
    <h1>
      <span class="icon">⚡</span>
      NEXUS AI
      <span class="badge">v2.0</span>
    </h1>
    <div class="subtitle">智能中枢 · 实时响应</div>
  </div>
</template>

<style scoped>
  .title-section {
    padding: 1.5rem 2rem 0.8rem;
    text-align: center;
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff, #00d4ff, #a855f7);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .icon {
    font-size: 2rem;
    filter: drop-shadow(0 0 6px #00d4ff);
    animation: iconPulse 2s infinite;
  }

  @keyframes iconPulse {
    0%,
    100% {
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
      text-shadow: 0 0 12px cyan;
    }
  }

  .badge {
    font-size: 0.7rem;
    background: rgba(0, 212, 255, 0.2);
    padding: 0.2rem 0.7rem;
    border-radius: 40px;
    border: 1px solid #00d4ff;
    color: #00d4ff;
    letter-spacing: 1px;
    font-weight: 400;
  }

  .subtitle {
    font-size: 0.8rem;
    color: #8a9bb5;
    margin-top: 8px;
    letter-spacing: 1px;
    font-family: monospace;
  }
</style>
