# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a Node.js-based MCP (Model Context Protocol) server that provides
AI capabilities, giving access to AI models from any OpenAI-compatible provider (OpenRouter, OpenAI, DeepSeek, etc.) through a unified interface.

The project provides one main tool:

1. **query_model** - AI assistant using OpenAI SDK to access various AI models

## Development Commands

- **Install dependencies**: `npm install`
- **Build project**: `npm run build`
- **Run server in dev mode**: `npm run dev` (uses `tsx` watch mode)
- **Run server**: `npm start` (requires build first)
- **Lint code**: `npm run lint`
- **Format code**: `npm run format`

## Environment Setup

**Required**: Set `OPENAI_API_KEY` environment variable before running.
Optionally set `OPENAI_MODEL` and `OPENAI_BASE_URL` to specify which model and provider to use.

```bash
export OPENAI_API_KEY=your_api_key_here
export OPENAI_MODEL=openai/gpt-4o-mini  # Optional, defaults to openai/gpt-4o-mini
export OPENAI_BASE_URL=https://openrouter.ai/api/v1 # Optional, defaults to OpenRouter
npm run dev
```

## Project Structure

```
src/
├── server.ts              # Main MCP server implementation
├── openai-client.ts       # API client wrapper using OpenAI SDK
└── tools/
    └── ask-ai.ts          # AI assistant tool
dist/                      # Compiled JavaScript output
```

## Architecture

- **Server**: `src/server.ts` implements the MCP server using `@modelcontextprotocol/sdk`. It handles tool requests and routes them to the appropriate handler.
- **Client**: `src/openai-client.ts` wraps the OpenAI SDK to communicate with the provider. It handles authentication and request formatting.
- **Tools**: `src/tools/` contains the implementation of MCP tools. Currently `ask_ai` is the only tool.

## Code Style

- **TypeScript**: Strict mode is enabled. Target ES2022.
- **Linting**: ESLint with TypeScript support.
- **Formatting**: Prettier is used for code formatting.

## Migration Context

This project was migrated from a Google Gemini specific implementation to a generic OpenAI-compatible implementation.
- It uses the OpenAI SDK to talk to any compatible provider.
- Environment variables `GEMINI_API_KEY` / `GEMINI_MODEL` are replaced by `OPENAI_API_KEY` / `OPENAI_MODEL` / `OPENAI_BASE_URL`.
- The package name is now `llm-mcp`.
