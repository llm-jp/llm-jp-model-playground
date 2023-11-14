import { PromptTemplate } from 'generative-ai-use-cases-jp';

import llmJp from './llmJp.json';
import llama2 from './llama2.json';
import rinna from './rinna.json';
import bilingualRinna from './bilingualRinna.json';
import claude from './claude.json';

export const PROMPT_TEMPLATE: { [key: string]: PromptTemplate } = {
  llmJp: llmJp,
  llama2: llama2,
  rinna: rinna,
  bilingualRinna: bilingualRinna,
  claude: claude,
};
