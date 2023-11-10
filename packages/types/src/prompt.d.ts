export type Model = {
  name: string;
  path: string;
  prompt_template_name: string;
};

export type PromptTemplate = {
  prefix: string;
  suffix: string;
  join: string;
  user: string;
  assistant: string;
  system: string;
  eos_token: string;
};
