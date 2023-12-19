import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { getOpenAIEmbeddings } from './embeddings.js';

async function generateVectorMemoryfromDocs(docs) {
  const embeddings = getOpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  return store;
}

export { generateVectorMemoryfromDocs };
