// agent-chat\src\components\Chat.jsx

import { useState } from 'react';
import { useStream } from '@langchain/langgraph-sdk/react';

export function Chat({ apiUrl, assistantId, onReset }) {
    // 以 apiUrl 和 assistantId 作为存储键，防止不同配置互相干扰
    const storageKey = `agent_thread_id_${apiUrl}_${assistantId}`;
    // 1. 持久化 threadId，防止刷新丢失会话
    const [threadId, setThreadId] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return saved;
        const id = crypto.randomUUID();
        localStorage.setItem(storageKey, id);
        return id;
    });

    const BaseUrl = String(apiUrl).replace(/\/$/, ''); // 去掉末尾斜杠
    const stream = useStream({
        apiUrl: BaseUrl,            // langgraph url
        assistantId: assistantId,
        messagesKey: 'messages',
        threadId, // 传入持久化的会话 ID，刷新自动拉取历史
        onThreadId: (id) => {
            setThreadId(id);
            localStorage.setItem(storageKey, id);
        },
    });

    // 3. 新建对话功能
    const createNewThread = useCallback(() => {
        const newId = crypto.randomUUID();
        localStorage.setItem(storageKey, newId);
        setThreadId(newId);
    }, [storageKey]);

    // 4. 内容归一化（防止数组格式导致 UI 崩溃）
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

    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        stream.submit({ messages: [{ type: 'human', content: input }] });
        setInput('');
    };

    return (
        <div style={{
            height: '100vh',
            boxSizing: 'border-box',   // 让 padding 算在 100vh 里
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
        }}>
            <div>
                <strong>{assistantId}</strong> · {BaseUrl}
                <button onClick={onReset} style={{ marginLeft: 12 }}>重新配置</button>
            </div>

            <div style={{
                flex: 1,
                minHeight: 0,          // 关键：允许 flex 子项收缩
                overflowY: 'auto',
                border: '1px solid #eee',
                padding: 12,
            }}>
                {stream.messages.map((msg, i) => (
                    <div key={msg.id ?? i} style={{ marginBottom: 8 }}>
                        <b>{msg.type}:</b> {String(msg.content)}
                    </div>
                ))}
                {stream.isLoading && <div>生成中…</div>}
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入消息…"
                    style={{ flex: 1, padding: 8 }}
                />
                <button type="submit">发送</button>
            </form>
        </div>
    );
}