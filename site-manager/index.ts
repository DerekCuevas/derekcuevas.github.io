import { z } from "https://deno.land/x/zod/mod.ts";
import { Post } from "../post-generator/index.ts";

const PostManifest = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  createdAt: z.coerce.date(),
});

type PostManifest = z.infer<typeof PostManifest>;

const Manifest = z.object({
  posts: z.array(PostManifest),
  updatedAt: z.coerce.date(),
});

type Manifest = z.infer<typeof Manifest>;

export class SiteManager {
  postsDirectory: string;
  manifestFile: string;

  constructor(postsDirectory: string, manifestFile: string) {
    this.postsDirectory = postsDirectory;
    this.manifestFile = manifestFile;
  }

  async readManifest(): Promise<Manifest> {
    const contents = await Deno.readTextFile(this.manifestFile);
    return Manifest.parse(JSON.parse(contents));
  }

  async writeManifest(manifest: Manifest): Promise<void> {
    await Deno.writeTextFile(
      this.manifestFile,
      JSON.stringify(manifest, null, 2)
    );
  }

  async writePost(post: Post): Promise<void> {
    const header = `---\ntitle: "${
      post.title
    }"\ndate: ${new Date().toISOString()}\ntags: ${JSON.stringify(
      post.tags
    )}\n---`;

    const filename = `${this.postsDirectory}/${post.slug}.md`;
    const contents = `${header}\n${post.body}`;

    await Deno.writeTextFile(filename, contents);
  }

  async addPost(post: Post): Promise<void> {
    const manifest = await this.readManifest();

    const postManifest: PostManifest = {
      title: post.title,
      tags: post.tags,
      createdAt: post.createdAt,
    };

    manifest.updatedAt = post.createdAt;
    manifest.posts.push(postManifest);

    await this.writeManifest(manifest);
    await this.writePost(post);
  }
}
