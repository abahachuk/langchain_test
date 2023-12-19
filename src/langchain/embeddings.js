import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

let embeddings;

function getOpenAIEmbeddings() {
  embeddings = embeddings || new OpenAIEmbeddings();

  return embeddings;
}

export { getOpenAIEmbeddings };
