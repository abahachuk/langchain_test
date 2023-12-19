import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAI } from 'langchain/llms/openai';
import './embeddings.js';

import { OPENAI_API_KEY } from '../config.js';

const MODEL = 'gpt-4-1106-preview';
const TEMPERATURE = 0.9;

const chatModel = new ChatOpenAI({
  apiKey: OPENAI_API_KEY,
  modelName: MODEL,
  temperature: TEMPERATURE,
});

const llmModel = new OpenAI({ temperature: TEMPERATURE });

export { chatModel, llmModel };
