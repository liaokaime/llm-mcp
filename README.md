# LLM MCP Server

提供通用 AI 能力的 Model Context Protocol (MCP) 服务器。它使用 OpenAI SDK 通过统一接口访问任何兼容 OpenAI 的 API（如 OpenRouter, OpenAI, DeepSeek, LocalAI 等）。本项目基于 Node.js 和 TypeScript 构建。

## 功能特性

- **query_model**：由任何兼容 OpenAI 的提供商驱动的 AI 助手
- 使用 OpenAI SDK 确保广泛的兼容性
- 完整的 TypeScript 支持，包含严格的类型检查
- 可自定义 Base URL 以支持任何提供商

## 前置要求

- [Node.js](https://nodejs.org/) (v18.0.0+)
- npm, pnpm, 或 yarn
- 你选择的提供商的 API Key

## 安装

### 从源码安装

1. 克隆此仓库：

```bash
git clone <repository-url>
cd llm-mcp
```

2. 安装依赖：

```bash
npm install
# 或者
pnpm install
# 或者
yarn install
```

3. 构建项目：

```bash
npm run build
```

4. 设置环境变量：

```bash
export OPENAI_API_KEY=your_api_key_here
export OPENAI_MODEL=openai/gpt-4o-mini  # 可选，默认为 openai/gpt-4o-mini
export OPENAI_BASE_URL=https://openrouter.ai/api/v1 # 可选，默认为 OpenRouter
```

## 使用方法

### 启动服务器

```bash
# 首先设置环境变量
export OPENAI_API_KEY=your_api_key_here
export OPENAI_MODEL=openai/gpt-4o-mini  # 可选
export OPENAI_BASE_URL=https://api.openai.com/v1 # 可选，例如用于官方 OpenAI

# 开发模式（带有监听和热重载）
npm run dev

# 生产模式（需要先构建）
npm run build
npm start
```

### 代码质量

```bash
# 格式化代码
npm run format

# 代码检查
npm run lint

# 构建 TypeScript
npm run build
```

## MCP 工具

### query_model

由你配置的 LLM 提供商驱动的 AI 助手。

**参数：**

- `prompt` (必填)：你要发送给 AI 模型的问题或请求。

**示例：**

```json
{
  "name": "query_model",
  "arguments": {
    "prompt": "量子计算的最新进展是什么？"
  }
}
```

**能力：**

- 🤖 访问任何兼容 OpenAI 的模型
- ⚡ 快速可靠的 API
- 📊 包含 token 计数的使用元数据
- 🔄 通过环境变量轻松切换模型

## 可用模型

本服务器支持你的后端提供的任何模型。

## 开发

本项目使用 Node.js 和 TypeScript。主要开发命令：

- `npm run dev` - 启动带有监听模式的开发服务器 (使用 tsx)
- `npm run build` - 将 TypeScript 构建为 JavaScript
- `npm run lint` - 代码检查
- `npm run format` - 使用 Prettier 格式化代码

## 故障排除

### 环境变量问题

如果你遇到环境变量错误：

1. **验证你的环境变量是否已设置**：

   ```bash
   echo $OPENAI_API_KEY
   echo $OPENAI_MODEL
   echo $OPENAI_BASE_URL
   ```

2. **对于 MCP Inspector 测试**，确保 API Key 设置在同一个终端中：

   ```bash
   export OPENAI_API_KEY=your_api_key_here
   export OPENAI_MODEL=openai/gpt-4o-mini
   npx @modelcontextprotocol/inspector npx tsx src/server.ts
   ```

3. **检查服务器日志**：当服务器启动时，它会显示 `(API Key: configured)` 来确认你的 Key 已加载。

## 支持

- [Model Context Protocol](https://modelcontextprotocol.io/)

## Claude Desktop 配置

要在 Claude Desktop 中使用此 MCP 服务器，请将其添加到你的 Claude 配置中：

### macOS/Linux

编辑你的 Claude 配置文件：
`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) 或
`~/.config/Claude/claude_desktop_config.json` (Linux)：

```json
{
  "mcpServers": {
    "llm": {
      "command": "node",
      "args": ["/absolute/path/to/llm-mcp/dist/server.js"],
      "env": {
        "OPENAI_API_KEY": "your_api_key_here",
        "OPENAI_MODEL": "openai/gpt-4o-mini",
        "OPENAI_BASE_URL": "https://openrouter.ai/api/v1"
      }
    }
  }
}
```

### Windows

编辑你的 Claude 配置文件：
`%APPDATA%\Claude\claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "llm": {
      "command": "node",
      "args": ["C:\\path\\to\\llm-mcp\\dist\\server.js"],
      "env": {
        "OPENAI_API_KEY": "your_api_key_here",
        "OPENAI_MODEL": "openai/gpt-4o-mini",
        "OPENAI_BASE_URL": "https://openrouter.ai/api/v1"
      }
    }
  }
}
```

### 本地开发

用于使用 tsx 进行热重载开发：

```json
{
  "mcpServers": {
    "llm": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/llm-mcp/src/server.ts"],
      "env": {
        "OPENAI_API_KEY": "your_api_key_here",
        "OPENAI_MODEL": "openai/gpt-4o-mini"
      }
    }
  }
}
```

## 贡献

1. Fork 仓库
2. 创建特性分支
3. 提交你的更改
4. 格式化代码：`npm run format`
5. 代码检查：`npm run lint`
6. 构建：`npm run build`
7. 提交 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。
