import { SerpAPI } from 'langchain/tools';
import { SERPAPI_API_KEY } from '../config.js';

const tools = [
  new SerpAPI(SERPAPI_API_KEY),
];

export default tools;
