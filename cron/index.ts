import { GenerateResult, PostGenerator } from "../post-generator/index.ts";
import { config } from "../config.ts";
import { SiteManager } from "../site-manager/index.ts";

export interface RunParams {
  postsDirectory: string;
  postsManifest: string;
  completionsDirectory: string;
  resumeFile: string;
}

async function saveCompletion(
  directory: string,
  result: GenerateResult,
): Promise<void> {
  const { post, prompt, completion, model } = result;
  const completionFilename = `${directory}/${post.slug}.json`;
  await Deno.writeTextFile(
    completionFilename,
    JSON.stringify({ model, prompt, completion }, null, " "),
  );
}

export async function run(params: RunParams): Promise<void> {
  const manager = new SiteManager(params.postsDirectory, params.postsManifest);
  const postGenerator = new PostGenerator(config.MOCK);

  const previousPosts = await manager.getPreviousPosts();
  const resume = await Deno.readTextFile(params.resumeFile);

  console.log("Generating post...");
  const result = await postGenerator.generatePost(resume, previousPosts);
  console.log(`Generated post:\n"${result.post.title}"`);

  console.log("Saving raw chat completion...");
  await saveCompletion(params.completionsDirectory, result);

  console.log("Publishing post...");
  await manager.addPost(result.post);

  console.log("Complete.");
}
