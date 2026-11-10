// src/hooks/useAgentChat.jsx
import { useStream } from "@langchain/langgraph-sdk/react";
import { useState, useCallback } from "react";

const useAgentChat = (apiUrl, assistantId, threadId, onThreadCreated) => {
    // const [threadId, setThreadId] = useState(
    //     // () => sessionStorage.getItem("activeThreadId")
    //     () => sessionStorage.getItem(`agent_thread_id_${apiUrl}_${assistantId}`) || null
    // );
    
    // 初始化 LangGraph 流
    const BaseUrl = String(apiUrl).replace(/\/$/, ""); // 去掉末尾斜杠
    const stream = useStream({
        apiUrl: BaseUrl, // langgraph url
        assistantId: assistantId,
        messagesKey: "messages",
        // threadId, // 传入持久化的会话 ID，刷新自动拉取历史
        // onThreadId: (id) => {
        //     setThreadId(id);
        //     if (id) sessionStorage.setItem("activeThreadId", id);
        // },
        threadId: threadId || undefined,
        onThreadId: (id) => {
            if (id) onThreadCreated(id);
        }
    });

    return stream
};

export default useAgentChat;