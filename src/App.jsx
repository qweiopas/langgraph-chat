// src/App.jsx
import { useState } from 'react';
import { ConfigForm } from './components/ConfigForm';
import AgentChat from './components/AgentChat';

export default function App() {
  // 1. 初始化时从 sessionStorage 读取配置
  const [config, setConfig] = useState(() => {
    const saved = sessionStorage.getItem('agent_config');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSave = (newConfig) => {
    sessionStorage.setItem('agent_config', JSON.stringify(newConfig));
    setConfig(newConfig);
  };

  const handleReset = () => {
    sessionStorage.removeItem('agent_config');
    setConfig(null);
  };

  if (!config) {
    return <ConfigForm onSave={handleSave} />;
  }

  return (
    <AgentChat
      apiUrl={config.apiUrl}
      assistantId={config.assistantId}
      onReset={handleReset}
    />
  );
}