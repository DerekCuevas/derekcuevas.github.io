import { parse } from "https://deno.land/std@0.182.0/flags/mod.ts";
import { run } from "./cron/index.ts";

const flags = parse(Deno.args, {
  string: ["posts", "manifest", "completions", "resume"],
  default: {
    posts: "./site/content/posts",
    manifest: "./site/data/manifest.json",
    completions: "./site/data/completions",
    resume: "./site/content/resume.md",
  },
});

async function main() {
  await run({
    postsDirectory: flags.posts,
    postsManifest: flags.manifest,
    completionsDirectory: flags.completions,
    resumeFile: flags.resume,
  });
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
