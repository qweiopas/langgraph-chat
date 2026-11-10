// src/components/ConfigForm.jsx
import { useState } from 'react';

export function ConfigForm({ onSave }) {
  // 优先读取上次的配置作为默认值
  const savedConfig = localStorage.getItem('agent_config');
  const initialConfig = savedConfig ? JSON.parse(savedConfig) : { apiUrl: 'http://127.0.0.1:2024', assistantId: 'agent' };

  const [apiUrl, setApiUrl] = useState(initialConfig.apiUrl);
  const [assistantId, setAssistantId] = useState(initialConfig.assistantId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiUrl.trim() || !assistantId.trim()) return;
    
    // 规范化 URL，去掉末尾斜杠
    const normalizedUrl = apiUrl.trim().replace(/\/$/, '');
    onSave({ apiUrl: normalizedUrl, assistantId: assistantId.trim() });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
      <form onSubmit={handleSubmit} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, textAlign: 'center' }}>连接 LangGraph</h2>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#555' }}>API URL</span>
          <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #d9d9d9', outline: 'none' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#555' }}>Assistant ID</span>
          <input value={assistantId} onChange={(e) => setAssistantId(e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #d9d9d9', outline: 'none' }} />
        </label>
        <button type="submit" style={{ padding: 10, background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 8, fontSize: 16 }}>连接</button>
      </form>
    </div>
  );
}