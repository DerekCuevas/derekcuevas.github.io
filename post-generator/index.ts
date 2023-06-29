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
    let [first, ...rest] = text.split("\n");

    rest = rest.filter((s) => s !== "---");

    const tagsLineIndex = rest.findIndex((s) =>
      s.toLowerCase().includes("tags:")
    );

    let tags: string[] = [];
    if (tagsLineIndex !== -1) {
      tags = rest
        .splice(tagsLineIndex, 1)[0]
        .toLowerCase()
        .replace("tags: ", "")
        .split(",")
        .map((t) => t.trim());
    }

    const title = first
      .replace("Title: ", "")
      .replaceAll("#", "")
      .replaceAll("*", "")
      .replaceAll('"', "")
      .trim();

    const slug = title.replaceAll(" ", "-").replaceAll("/", "-").toLowerCase();

    const body = rest.join("\n");

    return {
      title,
      slug,
      body,
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
    const text = completion.choices[0].message.content!;
    const post = this.parseCompletion(text);
    return { prompt, completion, post };
  }
}
