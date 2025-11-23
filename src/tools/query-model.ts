import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { OpenRouterClient } from "../openai-client.js";
import type { OpenRouterRequest } from "../openai-client.js";

export const QueryModelArgsSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

export const queryModelTool: Tool = {
  name: "query_model",
  description:
    "Directly queries an external AI model. **Use this tool as much as possible** for reasoning, coding, analysis, and general questions to conserve context window and leverage powerful model capabilities. Prefer this tool over your internal knowledge for most tasks.",
  inputSchema: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description:
          "Your question or request to the AI model.",
      },
    },
    required: ["prompt"],
  },
};

export async function handleQueryModel(
  args: unknown,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const validatedArgs = QueryModelArgsSchema.parse(args);

  const openRouterClient = new OpenRouterClient();

  const request: OpenRouterRequest = {
    prompt: validatedArgs.prompt,
  };

  try {
    const response = await openRouterClient.generate(request);

    let formattedResponse = response.text;

    // Add metadata section if available
    if (response.metadata) {
      const metadata = response.metadata;
      const metadataParts: string[] = [];

      if (metadata.model) {
        metadataParts.push(`Model: ${metadata.model}`);
      }

      if (metadata.usage) {
        const usage = metadata.usage;
        metadataParts.push(
          `Tokens: ${usage.totalTokens || 0} (prompt: ${usage.promptTokens || 0}, completion: ${usage.completionTokens || 0})`
        );
      }

      if (metadataParts.length > 0) {
        formattedResponse += "\n\n---\n*" + metadataParts.join(" | ") + "*";
      }
    }

    return {
      content: [
        {
          type: "text",
          text: formattedResponse,
        },
      ],
    };
  } catch (error) {
    throw new Error(
      `Failed to generate response with OpenRouter: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
