import { Construct } from 'constructs';
import * as sagemaker from '@aws-cdk/aws-sagemaker-alpha';
import { Model } from 'generative-ai-use-cases-jp';

const models: Model[] = [
  {
    name: 'llm-jp-13b-instruct-full-jaster-dolly-oasst-v1',
    path: 'models/llm-jp-13b-instruct-full-jaster-dolly-oasst-v1.0.tar.gz',
    prompt_template_name: 'llmJp',
  },
  {
    name: 'llm-jp-13b-instruct-lora-jaster-dolly-oasst-v1',
    path: 'models/llm-jp-13b-instruct-lora-jaster-dolly-oasst-v1.0.tar.gz',
    prompt_template_name: 'llmJp',
  },
];

export class LLM extends Construct {
  public readonly models: Model[] = models;
  public readonly deploy_suffix: string =
    '-' + new Date().toISOString().replace(/[:T-]/g, '').split('.')[0];
  public readonly endpointConfigName =
    'llm-jp-endpoint-config' + this.deploy_suffix;
  public readonly endpointName = 'llm-jp-endpoint';

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Get Container Image
    // https://github.com/aws/deep-learning-containers/blob/master/available_images.md
    const repositoryName = 'djl-inference';
    const tag = '0.24.0-deepspeed0.10.0-cu118';
    const image = sagemaker.ContainerImage.fromDlc(repositoryName, tag);

    // Create Models
    const sm_models = models.map((model) => {
      const modelData = sagemaker.ModelData.fromAsset(model.path);
      const sm_model = new sagemaker.Model(
        this,
        `sagemaker-model-${model.name}`,
        {
          modelName: model.name + this.deploy_suffix,
          containers: [
            {
              image: image,
              modelData: modelData,
            },
          ],
        }
      );
      return sm_model;
    });

    // Create Endpoint Config
    const endpointConfig = new sagemaker.EndpointConfig(
      this,
      'EndpointConfig',
      {
        endpointConfigName: this.endpointConfigName,
        instanceProductionVariants: models.map((modelConfig, idx) => {
          return {
            model: sm_models[idx],
            variantName: modelConfig.name,
            initialVariantWeight: 1,
            initialInstanceCount: 1,
            instanceType: sagemaker.InstanceType.G5_2XLARGE,
          };
        }),
      }
    );
    sm_models.forEach((sm_model) =>
      endpointConfig.node.addDependency(sm_model)
    );
  }
}
