import {
  ChatCompletion,
  OpenAI as OpenAIInner,
} from "https://deno.land/x/openai/mod.ts";
import { config } from "../config.ts";
import completionFixture from "./fixtures/chat-completion.json" assert { type: "json" };

export interface Prompt {
  contents: string;
}

export interface Message {
  role: "system" | "user";
  content: string;
}

export interface OpenAIClient {
  chatCompletion(messages: Message[]): Promise<ChatCompletion>;
}

export class MockOpenAIClient implements OpenAIClient {
  chatCompletion(_messages: Message[]): Promise<ChatCompletion> {
    return Promise.resolve(completionFixture as unknown as ChatCompletion);
  }
}

export class OpenAI implements MockOpenAIClient {
  openai: OpenAIInner;

  constructor() {
    this.openai = new OpenAIInner(config.OPENAI_API_KEY);
  }

  async chatCompletion(messages: Message[]): Promise<ChatCompletion> {
    return await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages,
    });
  }
}
