import { PostGenerator, GenerateResult } from "../post-generator/index.ts";
import { config } from "../config.ts";
import { BlogManager } from "../blog-manager/index.ts";

export interface RunParams {
  postsDirectory: string;
  postsManifest: string;
  completionsDirectory: string;
  resumeFile: string;
}

async function writeCompletion(
  directory: string,
  result: GenerateResult
): Promise<void> {
  const { post, prompt, completion } = result;
  await Deno.writeTextFile(
    `${directory}/${post.slug}.json`,
    JSON.stringify({ prompt, completion }, null, " ")
  );
}

export async function run(params: RunParams) {
  const manager = new BlogManager(params.postsDirectory, params.postsManifest);
  const postGenerator = new PostGenerator(config.MOCK);

  const manifest = await manager.readManifest();
  const previousPosts = manifest.posts.map((p) => p.title);

  const resume = await Deno.readTextFile(params.resumeFile);

  console.log("Generating post...");
  const result = await postGenerator.generatePost(resume, previousPosts);
  console.log(`Generated post:\n"${result.post.title}"`);

  await writeCompletion(params.completionsDirectory, result);
  await manager.addPost(result.post);

  console.log("Complete.");
}
