// import { StringOutputParser } from 'langchain/schema/output_parser';
// import { SequentialChain, loadQAStuffChain, LLMChain } from 'langchain/chains';

import { loadQAStuffChain } from 'langchain/chains';

import {
  doSearch, fetchMultipleUrls,
} from './utils.js';
import { chatModel } from './langchain/models.js';
import { generateDocuments } from './langchain/documents.js';
import { generateVectorMemoryfromDocs } from './langchain/memory.js';
import { electionQuestionPrompt } from './langchain/prompts.js';

const context = `Act as a political expert and provide an analysis of the current geopolitical situation.
I'm particularly interested in the dynamics between major world powers in relation to trade, security, and environmental policies.
How are these aspects influencing international relations and what could be the potential future implications`;

const electionQuestion = 'Who emerged victorious in the parliamentary elections in the Netherlands?';

// Google search
const searchResult = await doSearch(electionQuestion);

const urls = [
  ...searchResult.organic.map(({ link }) => link),
  ...searchResult.peopleAlsoAsk.map(({ link }) => link),
];

// Form a storage urls->html->texts->docs->store
const texts = await fetchMultipleUrls(urls);
const docs = await generateDocuments(texts);

const store = await generateVectorMemoryfromDocs(docs);
const relevantDocs = await store.similaritySearch(electionQuestion);

const electionChain = loadQAStuffChain(chatModel, {
  prompt: electionQuestionPrompt,
});

// const politicalChain = new LLMChain({
//   llmModel,
//   prompt: politicalQuestionPrompt,
//   outputParser: parser,
//   outputKey: 'review',
// });

// const overallChain = new SequentialChain({
//   chains: [electionChain, politicalChain],
//   inputVariables: ['election_result', 'input_documents', 'election_question', 'context', 'political_question'],
//   outputVariables: ['election_result', 'review'],
//   verbose: true,
// });

// const chainExecutionResult = await overallChain.call({
//   input_documents: relevantDocs,
//   context,
//   election_question: electionQuestion,
//   political_question: 'Given the election results, what forecast can be made for the future of the Dutch political system?',
// });

const electionResult = await electionChain.call({
  input_documents: relevantDocs,
  election_question: electionQuestion,
  context,
});

console.log('___The Question: ', electionQuestion);
console.log('___Elections Result:', electionResult.text);
