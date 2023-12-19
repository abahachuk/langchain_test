import { PromptTemplate } from 'langchain/prompts';

const electionQuestionPromptTemplateString = `Context information is below.
---------------------
{context}
---------------------
Given the context information, answer the question: {election_question}`;

const electionQuestionPrompt = new PromptTemplate({
  inputVariables: ['context', 'election_question'],
  template: electionQuestionPromptTemplateString,
});

const politicalQuestionPromptTemplateString = `Elections results is below.
---------------------
{election_result}
---------------------
Given the elections results, answer the question: {political_question}`;

const politicalQuestionPrompt = new PromptTemplate({
  inputVariables: ['election_result', 'political_question'],
  template: politicalQuestionPromptTemplateString,
});

export { electionQuestionPrompt, politicalQuestionPrompt };
