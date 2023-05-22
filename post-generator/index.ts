import { ChatCompletion } from "https://deno.land/x/openai/mod.ts";
import { OpenAIClient, MockOpenAIClient, OpenAI, Message } from "./openai.ts";
import { getChatPrompt } from "./prompts.ts";

export interface Post {
  title: string;
  slug: string;
  body: string;
  tags: string[];
  createdAt: Date;
}

export interface GenerateResult {
  prompt: Message[];
  completion: ChatCompletion;
  post: Post;
}

export class PostGenerator {
  openai: OpenAIClient;

  constructor(mock: boolean) {
    this.openai = mock ? new MockOpenAIClient() : new OpenAI();
  }

  parseCompletion(text: string): Post {
    const [first, ...body] = text.split("\n");

    const title = first
      .replace("Title: ", "")
      .replaceAll("#", "")
      .replaceAll('"', "")
      .trim();

    const [tagsString] = body.splice(body.length - 1);
    const matchResult = tagsString
      .toLowerCase()
      .replaceAll(".", "")
      .match(/tags: (.+)/);
    const tags = matchResult ? matchResult[1].split(", ") : [];

    return {
      title,
      slug: title.replaceAll(" ", "-").replaceAll("/", "-").toLowerCase(),
      body: body.join("\n"),
      tags,
      createdAt: new Date(),
    };
  }

  async generatePost(
    resume: string,
    previousPosts: string[]
  ): Promise<GenerateResult> {
    const prompt = getChatPrompt(resume, previousPosts);
    const completion = await this.openai.chatCompletion(prompt);
    const text = completion.choices[0].message.content;
    const post = this.parseCompletion(text);
    return { prompt, completion, post };
  }
}
