// src/components/AgentChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Sender } from '@ant-design/x';
import { Flex, Spin, Alert, Button, Space, Layout, Typography, Popconfirm } from 'antd';
import useAgentChat from '../hooks/useAgentChat';

const { Sider, Content } = Layout;
const { Text } = Typography;

const AgentChat = ({ apiUrl, assistantId, onReset }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const storageKey = `agent_threads_${apiUrl}_${assistantId}`;
  // const stream = useAgentChat(apiUrl, assistantId);

  // 维护会话列表和当前激活的会话
  const [threads, setThreads] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeThreadId, setActiveThreadId] = useState(null);
  // 初始化聊天流
  const stream = useAgentChat(apiUrl, assistantId, activeThreadId, (newThreadId) => {
    // 新线程创建后的回调
    const newThread = {
      id: newThreadId,
      title: `Chat ${Date.now()}`,
      createdAt: Date.now(),
    }
    const updatedThreads = [newThread, ...threads];
    setThreads(updatedThreads);
    sessionStorage.setItem(storageKey, JSON.stringify(updatedThreads));
    setActiveThreadId(newThreadId);
  });

  // 切换会话
  const handleSwitchThread = (id) => {
    setActiveThreadId(id);
  };

  // 新建对话（清空当前激活 ID）
  const handleNewChat = () => {
    setActiveThreadId(null);
    setInput('');
  };

  // 删除会话
  const handleDeleteThread = (e, id) => {
    e.stopPropagation();
    const updatedThreads = threads.filter(t => t.id !== id);
    setThreads(updatedThreads);
    sessionStorage.setItem(storageKey, JSON.stringify(updatedThreads));

    // 如果删除的是当前正在聊的，清空右侧
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  // 组件内部实现内容归一化
  const normalizeContent = (content) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("");
    }
    return "";
  };

  // // 组件内部实现新建对话（清空缓存并刷新）
  // const handleNewThread = () => {
  //   sessionStorage.removeItem("activeThreadId");
  //   window.location.reload();
  // };

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stream.messages]);

  const handleSubmit = (value) => {
    if (!value.trim() || stream.isLoading) return;
    stream.submit({
      messages: [{ type: 'human', content: value }],
    });
    setInput('');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 左侧边栏 */}
      <Sider width={260} theme="light" style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
          <Button type="primary" block onClick={handleNewChat}>
            + 新建对话
          </Button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {threads.map(thread => (
            <div
              key={thread.id}
              onClick={() => handleSwitchThread(thread.id)}
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                marginBottom: 4,
                cursor: 'pointer',
                background: activeThreadId === thread.id ? '#e6f4ff' : 'transparent',
                color: activeThreadId === thread.id ? '#1677ff' : '#333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text ellipsis style={{ flex: 1, color: 'inherit' }}>{thread.title}</Text>
              <Popconfirm
                title="确定删除该对话吗？"
                onConfirm={(e) => handleDeleteThread(e, thread.id)}
                onCancel={(e) => e.stopPropagation()}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  onClick={(e) => e.stopPropagation()}
                >
                  删除
                </Button>
              </Popconfirm>
            </div>
          ))}
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <Button danger block onClick={onReset}>重新配置</Button>
        </div>
      </Sider>

      {/* 右侧聊天区 */}
      <Content style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold' }}>{assistantId}</span>
          <span style={{ color: '#999', fontSize: 12 }}>{apiUrl}</span>
        </div>

        {stream.error && (
          <Alert
            message="连接 Agent 失败"
            description={stream.error.message}
            type="error" showIcon
            style={{ margin: '16px 24px 0' }}
          />
        )}

        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {(!stream.messages || stream.messages.length === 0) && !stream.isLoading ? (
            <div style={{ textAlign: 'center', color: '#999', marginTop: 80 }}>
              {activeThreadId ? '该对话暂无消息' : '开始一段新的对话吧'}
            </div>
          ) : (
            (stream.messages || []).map((msg, index) => {
              const isHuman = msg.type === 'human';
              return (
                <div key={msg.id || index} style={{ marginBottom: 16, display: 'flex', justifyContent: isHuman ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '75%', padding: '12px 16px', borderRadius: 8,
                    background: isHuman ? '#1677ff' : '#f5f5f5',
                    color: isHuman ? '#fff' : '#000',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                  }}>
                    {normalizeContent(msg.content)}
                  </div>
                </div>
              );
            })
          )}
          {stream.isLoading && (!stream.messages || stream.messages.length === 0) && (
            <div style={{ textAlign: 'center', marginTop: 16 }}><Spin /></div>
          )}
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <Sender
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            loading={stream.isLoading}
            onCancel={stream.stop}
            placeholder="输入消息…"
          />
        </div>
      </Content>
    </Layout>
  );
};

export default AgentChat;