
-----

## 2025.6.28初版Agent运行指南

请按照以下步骤在您的本地计算机上部署并运行本项目。

### 1\. 安装 Node.js

  - 访问 [Node.js 官网下载页面](https://nodejs.org/en/download)。
  - 页面所有下载设置全部保持默认，下载`.msi` 安装包。
  - 运行安装程序，所有设置保持默认即可。

### 2\. 解压项目文件

  - 将下载的项目压缩包解压。
  - **建议**将解压后的文件夹放置在纯英文路径下（例如 `D:\projects\law-agent`），避免路径问题。

### 3\. 启动后端服务

1.  打开一个命令提示符（CMD）窗口（我们称之为 `CMD1`）。
2.  使用 `cd /d` 命令，将当前目录切换到项目的 `backend` 文件夹。
    ```bash
    cd /d D:\_Lab\law-agent\backend
    ```
    > *注意：请将上面的路径替换为自己电脑上 `backend` 文件夹的实际路径。*
3.  在 `CMD1` 中，输入以下命令来启动后端服务：
    ```bash
    node server.js
    ```
4.  当您看到以下提示信息时，代表后端服务已成功启动：
    ```
    后端服务器正在 http://localhost:3000 上运行
    ```
    > *请保持此终端窗口不要关闭。*

### 4\. 启动前端服务

1.  **另外打开一个新**的命令提示符（CMD）窗口（我们称之为 `CMD2`）。
2.  使用 `cd /d` 命令，将当前目录切换到项目的 `frontend` 文件夹。
    ```bash
    cd /d D:\_Lab\law-agent\frontend
    ```
    > *注意：请将上面的路径替换为自己电脑上 `frontend` 文件夹的实际路径。*
3.  在 `CMD2` 中，输入以下命令来启动前端服务：
    ```bash
    npm run dev
    ```
4.  当您看到类似以下的提示信息时，代表前端服务已成功启动：
    ```
      VITE v5.x.x  ready in xxx ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
    ```node 

### 5\. 开始使用

  - 在您的浏览器中打开地址：`http://localhost:5173/`
  - 可以开始使用了。

# 法学实务写作助手 (Law Agent)

这是一个基于大语言模型（LLM）API的法学实务写作辅助工具。项目旨在提供一个简洁的写作环境，用户可以输入草稿文本，通过调用云端大模型进行语言润色，并实时对比原文和优化后的版本，以提高法律文书的专业性和规范性。

## 技术栈 (Technology Stack)

本项目采用前后端分离的架构。

### 后端 (Backend)
- **环境**: Node.js (v18+ 推荐)
- **框架**: Express.js
- **API调用**: 使用 Node.js 内置的 `fetch` API 进行外部LLM服务调用
- **环境管理**: `dotenv`

### 前端 (Frontend)
- **框架**: Vue.js 3
- **构建工具**: Vite
- **API通信**: Axios

## 项目结构

```
law-agent/
├── backend/      # 后端服务 (Node.js + Express)
│   ├── .env      # (需要手动创建) 环境变量文件
│   ├── server.js # 服务器主文件，后端逻辑设计主要是这个
│   └── package.json
├── frontend/     # 前端应用 (Vue 3 + Vite)
│   ├── src/
│   │   └── App.vue # 主要应用组件，前端界面设计主要是这个
│   └── package.json
└── README.md     # 本文档
```