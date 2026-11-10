<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project. -->

# Agent Chat UI

基于 React + Vite + Ant Design X 的 LangGraph Agent 聊天界面。

## 功能

- 表单配置 API URL 和 Assistant ID，连接任意 LangGraph 服务
- 多会话管理：新建、切换、删除，会话列表保存在 localStorage
- 每个会话独立 threadId，切换后恢复对应历史
- 流式响应，支持中途取消
- 后端异常时显示错误提示

## 技术栈

- React 19 + Vite 8
- Ant Design 6 + Ant Design X 2
- @langchain/langgraph-sdk

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm dev

# 构建生产版本
pnpm build
```

## 使用说明

1. 首次打开填写 **API URL**（如 `http://127.0.0.1:2024`）和 **Assistant ID**（如 `agent`）
2. 点击「连接」进入聊天界面
3. 左侧可新建、切换、删除对话
4. 底部输入框发送消息，生成中可取消
5. 点击左下角「重新配置」可清空配置返回表单

## 目录结构

```text
src/
├── components/
│   ├── AgentChat.jsx    # 聊天主界面
│   └── ConfigForm.jsx   # 连接配置表单
├── hooks/
│   └── useAgentChat.js  # LangGraph 流封装
└── App.jsx              # 入口，配置读取与页面切换
```


## License

MIT