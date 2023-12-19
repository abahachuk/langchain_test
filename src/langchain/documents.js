import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

async function generateDocuments(texts) {
  const docs = await texts.reduce(async (accPromise, text) => {
    const acc = await accPromise;
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 8192,
      chunkOverlap: 2,
    });

    const tempDocs = await splitter.createDocuments([text]);

    return [...acc, ...tempDocs];
  }, Promise.resolve([]));

  return docs;
}

export { generateDocuments };
