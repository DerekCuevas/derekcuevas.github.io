import * as dotenv from "https://deno.land/x/dotenv/mod.ts";

export interface Config {
  MOCK: boolean;
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
}

// deno-lint-ignore no-explicit-any
const dotenvConfig = dotenv.config() as any;
dotenvConfig.MOCK = dotenvConfig.MOCK == "true";

export const config = dotenvConfig as Config;
