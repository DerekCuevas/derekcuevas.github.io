import { Message } from "./openai.ts";

const PREVIOUS_POST_COUNT = 60;

export const getChatPrompt = (
  resume: string,
  previousPosts: string[],
): Message[] => [
  {
    role: "user",
    content:
      "You are the author of a personal technical blog about software engineering and computer science subjects.",
  },
  {
    role: "user",
    content:
      `New topics for blog posts should be based off of the technical skills, experience, and interests presented in the following resume:\n${resume}`,
  },
  {
    role: "user",
    content: `Your previous ${PREVIOUS_POST_COUNT} posts include: ${
      previousPosts
        .slice(-PREVIOUS_POST_COUNT)
        .reverse()
        .map((title) => `\"${title}\"`)
        .join(", ")
    }`,
  },
  {
    role: "user",
    content:
      "Come up with an advanced topic for an expert level reader that is about a particular single feature, fact, pattern, paradigm, convention, theory, framework, library, or best practice.",
  },
  {
    role: "user",
    content:
      "Write a post about the chosen topic following the instructions given below:",
  },
  {
    role: "user",
    content:
      "Your writing style is academic, informative, and focused on detailed technical information.",
  },
  {
    role: "user",
    content: "The topic should not be related to a previous post.",
  },
  {
    role: "user",
    content:
      "Use computer code snippets (in the relevant programming language) in order to illustrate the information presented.",
  },
  {
    role: "user",
    content: "Format the body of the post in the markdown markup language.",
  },
  {
    role: "user",
    content:
      "Come up with a title for the post and include it on the first line.",
  },
  {
    role: "user",
    content:
      'Include one to three tags for the post on the second line formatted as a comma separated list, for example: "Tags: <tag1>, <tag2>".',
  },
  {
    role: "user",
    content: "The post should be multiple sections in length.",
  },
  {
    role: "user",
    content: "Do not include links to images in the post.",
  },
  {
    role: "user",
    content: "Do not include contact information in the post.",
  },
  {
    role: "user",
    content: "Do not add extra whitespace around lists.",
  },
];
