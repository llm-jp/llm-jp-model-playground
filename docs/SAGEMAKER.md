# Amazon SageMaker のカスタムモデルを利用する場合

Amazon SageMaker エンドポイントにデプロイされた大規模言語モデルを利用することが可能です。

DJL を使用した SageMaker Endpoint に対応しています。

モデルはユーザーとアシスタントが交互に発言するチャット形式のプロンプトをサポートしているのが理想的です。

## SageMaker エンドポイントのデプロイ

**利用可能なモデル**

- [LLM-JP-13B]

これらのモデル以外でもチャット形式に対応していて DJL でデプロイしたモデルは利用可能です。

## モデルを追加する

1. `packages/cdk/models` に新しいフォルダを追加し `serving.properties` を追加する。
    1. 他のモデルを参考にパラメータを変更してください
    2. DJL のパラメータの設定の仕方や Dependency の追加、推論コードのオーバーライド方法については [ドキュメント](https://sagemaker.readthedocs.io/en/stable/frameworks/djl/using_djl.html)をご確認ください。
2. `./package_models.sh` を実行し、設定ファイルを圧縮する。
3. `packages/cdk/lib/construct/llm.ts` にモデルのパスを追加する。
```
  {
    name: 'llm-jp-13b-instruct-full-jaster-dolly-oasst-v1',
    path: 'models/llm-jp-13b-instruct-full-jaster-dolly-oasst-v1.0.tar.gz',
    prompt_template_name: 'llmJp',
  },
```
4. `npm run cdk:deploy` でモデルをデプロイする。
5. モデルを反映させるためにはエンドポイントを再起動する必要があるため、一度エンドポイントを落として立ち上げ直す。
