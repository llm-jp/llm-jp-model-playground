import {
  Model,
  PromptTemplate,
  UnrecordedMessage,
} from 'generative-ai-use-cases-jp';
import { PROMPT_TEMPLATE } from '../prompt-templates/prompt_template';

const useModel = () => {
  const models: Model[] = JSON.parse(
    import.meta.env.VITE_APP_SAGEMAKER_MODELS || '[]'
  );
  const model2pt = Object.fromEntries(
    models.map((model) => {
      return [model.name, model.prompt_template_name];
    })
  );

  const generatePrompt = (messages: UnrecordedMessage[], modelName: string) => {
    const pt: PromptTemplate = getPromptTemplate(modelName);
    const prompt =
      pt.prefix +
      messages
        .map((message) => {
          if (message.role == 'user') {
            return pt.user.replace('{}', message.content);
          } else if (message.role == 'assistant') {
            return pt.assistant.replace('{}', message.content);
          } else if (message.role === 'system') {
            return pt.system.replace('{}', message.content);
          } else {
            throw new Error(`Invalid message role: ${message.role}`);
          }
        })
        .join(pt.join) +
      pt.suffix;
    return prompt;
  };

  const processOutput = (text: string, modelName: string) => {
    const pt: PromptTemplate = getPromptTemplate(modelName);
    return text.replace(pt.eos_token, '');
  };

  const getPromptTemplate = (modelName: string): PromptTemplate => {
    return PROMPT_TEMPLATE[model2pt[modelName]];
  };

  return {
    models,
    generatePrompt,
    getPromptTemplate,
    processOutput,
  };
};

export default useModel;
