+++
title = "What is FYGT?"
description = "How this blog works."
date = "2023-05-20"
aliases = ["about", "contact"]
author = "Derek Cuevas"
+++

This website is a fully automated experimental personal technical blog created by me, for me, [Derek Cuevas](../resume), that writes itself using OpenAI's [ChatGPT](https://openai.com/blog/chatgpt).

It's hosted on [GitHub Pages](https://pages.github.com/) and runs on [GitHub Actions](https://github.com/features/actions). New blog posts are auto-generated and then published to the site every day.

Checkout the [home page](../) for the most recent posts and also to see when the next new post will be generated. 

Note that this project is created entirely for fun and learning purposes, and in no way do I intend to claim credit for the posts published here. Here is the [source code](https://github.com/DerekCuevas/derekcuevas.github.io) for the project.

## The Stack

- [Deno](https://deno.com/): A secure runtime for TypeScript.
- [OpenAI API](https://openai.com/blog/openai-api): Empowering the blog post generation process via ChatGPT.
- [Hugo](https://gohugo.io/): The static site generator used to build the blog.
- [GitHub Pages](https://pages.github.com/): Hosting the static site.
- [GitHub Actions](https://github.com/features/actions): Automating the deployment and generation of new posts.

## How It Works

The project consists of two main parts:

1. **The Static Site:** built with `Hugo` and configured to [automatically deploy to GitHub Pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/) whenever new content has been pushed to the site's directory in the repo.

2. **The Post Generator:** A project built with `Deno` that generates content for the blog leveraging OpenAI's `ChatGPT`. Configured to run as a [scheduled Github Action](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) in order to periodically update the site.

The post generator is fed [my resume](../resume) and its previously generated posts. It prompts `ChatGPT` (currently `gpt-3.5-turbo`) to come up with and generate a new technical blog post as though it is me, choosing a topic relevant for my skills and experience.

The generated content is then transformed into a Hugo post, committed, and pushed to the repo in order to publish it onto the blog.

## Project Takeaways and Observations

This project has been a pretty fun and entertaining experiment with `ChatGPT`.

I've seen a lot of fascinating and diverse posts, but their quality and accuracy can vary greatly. Unfortunately, many of the published posts make up facts, which is quite disappointing, but also expected given the model's tendency to "hallucinate" information.

Some of my favorite posts so far include:

- [Writing Rust Macros: A Comprehensive Guide](/posts/writing-rust-macros-a-comprehensive-guide/)
- [Advanced Swift: Using Protocol Composition to Achieve Type-Safe, Modular Code](/posts/advanced-swift-using-protocol-composition-to-achieve-type-safe-modular-code/)
- [Weird Rust Features](/posts/weird-rust-features/)
- [A Comprehensive Guide to Asynchronous Programming in Swift with Combine](https://derekcuevas.github.io/posts/a-comprehensive-guide-to-asynchronous-programming-in-swift-with-combine/)

And some others which are not so great (including some made up information or are just odd in general) include:

- [Mastering JavaScript's Array.concat() Method for High-Performance and Scalable Code](/posts/mastering-javascripts-array.concat-method-for-high-performance-and-scalable-code/)
- [Using Rust's Pinning API for Safe and Performant Async Programming](/posts/using-rusts-pinning-api-for-safe-and-performant-async-programming/)

Overall, I've enjoyed looking forward to the blog's posts. It has become a cool new addition to my daily reading list, and, uniquely, has provided me with opportunities to learn and explore topics and technologies relevant to my professional skills that I might not have known about.

## Future Ideas

Here are some ideas for future enhancements:

- Integration with the [Stack Overflow API](https://api.stackexchange.com/docs) or similar freely available API to find trending or relevant topics enabling more specific and detailed prompts for post generation. This could further improve the quality and relevance of the generated posts.
- Upgrade to [GPT-4](https://openai.com/product/gpt-4) (awaiting access :crossed-fingers:) to enable longer posts (more tokens) and hopefully higher quality output (less hallucinations, more recent training dataset, and improved abilities to follow instruction).
