import { PostGenerator } from "../post-generator/index.ts";
import { config } from "../config.ts";
import { SiteManager } from "../site-manager/index.ts";

export interface RunParams {
  postsDirectory: string;
  postsManifest: string;
  completionsDirectory: string;
  resumeFile: string;
}

export async function run(params: RunParams) {
  const manager = new SiteManager(params.postsDirectory, params.postsManifest);
  const postGenerator = new PostGenerator(config.MOCK);

  const manifest = await manager.readManifest();
  const previousPosts = manifest.posts.map((p) => p.title);

  const resume = await Deno.readTextFile(params.resumeFile);

  console.log("Generating post...");
  const { post, prompt, completion } = await postGenerator.generatePost(
    resume,
    previousPosts
  );
  console.log(`Generated post:\n"${post.title}"`);

  const completionFilename = `${params.completionsDirectory}/${post.slug}.json`;
  console.log(`Saving raw chat completion to ${completionFilename}...`);
  await Deno.writeTextFile(
    completionFilename,
    JSON.stringify({ prompt, completion }, null, " ")
  );

  console.log("Publishing post...");
  await manager.addPost(post);

  console.log("Complete.");
}
