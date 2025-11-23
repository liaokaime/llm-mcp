import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { askAiTool, handleAskAi } from "./tools/ask-ai.js";

class OpenRouterMcpServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer(
      {
        name: "llm-mcp-server",
        version: "0.1.0",
      },
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.tool(
      askAiTool.name,
      askAiTool.description!,
      askAiTool.inputSchema.properties as any,
      async (args: any) => {
        const result = await handleAskAi(args);
        return result;
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    const hasApiKey = !!(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY);
    const model = process.env.OPENAI_MODEL || process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
    const baseURL = process.env.OPENAI_BASE_URL || process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

    console.error(
      `LLM MCP Server running on stdio (API Key: ${
        hasApiKey ? "configured" : "NOT SET"
      }, Model: ${model}, Base URL: ${baseURL})`,
    );
  }
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    console.error("Please set your API key:");
    console.error("export OPENAI_API_KEY=your_api_key_here");
    console.error("export OPENAI_MODEL=openai/gpt-4o-mini  # Optional, defaults to openai/gpt-4o-mini");
    console.error("export OPENAI_BASE_URL=https://openrouter.ai/api/v1 # Optional");
    process.exit(1);
  }

  const server = new OpenRouterMcpServer();
  await server.run();
}

// Export for testing
export { OpenRouterMcpServer };

// Run the server only if this module is the main entry point
if (import.meta.url === `file://${process.argv[1]}` ||
    import.meta.url.endsWith(process.argv[1])) {
  main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}
