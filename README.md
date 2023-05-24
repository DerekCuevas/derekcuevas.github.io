# FYGT

[What is FYGT?](https://derekcuevas.github.io/about/)

## Local Development

1. Install [Deno](https://deno.com/manual@v1.33.4/getting_started/installation)
2. Install [Hugo](https://gohugo.io/installation/)
3. Create a `.env` file and set `OPENAI_API_KEY`
4. Run the `main.ts` CLI to generate a post: `deno run --allow-net --allow-write --allow-read --allow-env main.ts`
5. Start the static site's development server: `cd site && hugo server`
