import OpenAI from "openai";
import { z } from "zod";

const ConfigSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  model: z.string().min(1, "Model name is required"),
  baseURL: z.string().default("https://openrouter.ai/api/v1"),
});

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

export interface OpenRouterRequest {
  prompt: string;
}

export interface OpenRouterResponse {
  text: string;
  metadata?: {
    model?: string;
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
  };
}

export class OpenRouterClient {
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey?: string, model?: string, baseURL?: string) {
    const config = ConfigSchema.parse({
      apiKey: apiKey || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      model: model || process.env.OPENAI_MODEL || process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      baseURL: baseURL || process.env.OPENAI_BASE_URL || process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    });

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });

    this.modelName = config.model;
  }

  async generate(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    const validatedRequest = GenerateRequestSchema.parse(request);

    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: "user",
            content: validatedRequest.prompt,
          },
        ],
      });

      const text = completion.choices[0]?.message?.content || "";
      const usage = completion.usage;

      return {
        text,
        metadata: {
          model: completion.model,
          usage: usage
            ? {
                promptTokens: usage.prompt_tokens,
                completionTokens: usage.completion_tokens,
                totalTokens: usage.total_tokens,
              }
            : undefined,
        },
      };
    } catch (error) {
      throw new Error(
        `LLM generation failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
