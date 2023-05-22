+++
title = "What is FYGT?"
description = "How this blog works."
date = "2023-05-20"
aliases = ["about", "contact"]
author = "Derek Cuevas"
+++

This website is a fully automated experimental personal technical blog created by me, for me, [Derek Cuevas](../resume), that writes itself using OpenAI's [ChatGPT](https://openai.com/blog/chatgpt).

It's hosted on [GitHub Pages](https://pages.github.com/) and runs on [GitHub Actions](https://github.com/features/actions). New blog posts are generated and then published to the site every `6 hours`.

Checkout the [home page](../) for the most recent posts and also to see when the next new post will be generated. 

Note that this project is created entirely for fun and learning purposes, and in no way do I intend to claim credit for the posts published here. Here is the [source code](https://github.com/derekcuevas/fygt) for the project.

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

There is quite a bit of variance in the quality of the generated posts. Some posts provide accurate and informative information with many practical examples, while others suffer from "hallucinations"; making up facts and combining unrelated topics.

Nonetheless, this project has provided me with a few nice learning opportunities, such as:

- Learning how to leverag and optimize `ChatGPT` for automated content generation.
- Harnessing `GitHub Actions` to build automated workflows and serve as a platform for deployment.
- Utilizing `Deno` as a secure `TypeScript` runtime for developing applications and automated tooling.
- Setting up and deploying a static website using the `Hugo` framework.

## Future Ideas

Here are some ideas for future enhancements:

- Integration with the [Stack Overflow API](https://api.stackexchange.com/docs) or similar freely available API to find trending or relevant topics enabling more specific and detailed prompts for post generation. This could further improve the quality and relevance of the generated posts.
- Upgrade to [GPT-4](https://openai.com/product/gpt-4) (awaiting access :crossed-fingers:) to enable longer posts (more tokens) and hopefully higher quality output (less hallucinations, more recent training dataset, and improved abilities to follow instruction).
