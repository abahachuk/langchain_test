import { config } from 'dotenv';

config();

export const { OPENAI_API_KEY } = process.env;
export const { SERPAPI_API_KEY } = process.env;
