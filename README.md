# LLM JP Model Playground

このレポジトリは、複数のモデルを SageMaker 上にデプロイしデモが行える Playground のサンプルコードです。

![sc_lp.png](/imgs/sc_lp.png)

## 機能一覧

> :white_check_mark: ... 実装されている、:construction: ... まだ実装されていない

- :white_check_mark: Amazon SageMaker で LLM をデプロイ
- :construction: Fine-tuning 用のデータ収集
- :construction: Fine-tuning 用データのラベリング
- :construction: Fine-tuning の実行

## アーキテクチャ

このサンプルでは、フロントエンドは React を用いて実装し、静的ファイルは Amazon CloudFront + Amazon S3 によって配信されています。バックエンドには Amazon API Gateway + AWS Lambda、認証には Amazon Congito 、チャット履歴等の保存には Amazon DynamoDB を使用しています。また、LLM は Amazon SageMaker を使用します。

![arch.png](/imgs/arch.png)

## デプロイ

まず最初にリージョンを指定する。`g5.2xlarge` でデプロイする際は `us-west-2` などの対応リージョンを設定する。

```bash
export AWS_DEFAULT_REGION=us-west-2
```

[AWS Cloud Development Kit](https://aws.amazon.com/jp/cdk/)（以降 CDK）を利用してデプロイします。最初に、npm パッケージをインストールしてください。なお、全てのコマンドはルートディレクトリで実行してください。また、[こちらの動画](https://www.youtube.com/watch?v=9sMA17OKP1k)でもデプロイ手順を確認できます。

```bash
npm ci
```

CDK を利用したことがない場合、初回のみ [Bootstrap](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/bootstrapping.html) 作業が必要です。すでに Bootstrap された環境では以下のコマンドは不要です。

```bash
npx -w packages/cdk cdk bootstrap
```

続いて、以下のコマンドで AWS リソースをデプロイします。デプロイが完了するまで、お待ちください（20 分程度かかる場合があります）。

```bash
npm run cdk:deploy
```

### モデル・リージョンの切り替え

詳細は [/docs/SAGEMAKER.md](docs/SAGEMAKER.md) をご確認ください。

## Pull Request を出す場合

バグ修正や機能改善などの Pull Request は歓迎しております。コミットする前に、lint ツールを実行してください。

```bash
npm run lint
```

また、ローカル環境の構築手順については [/docs/DEVELOPMENT.md](/docs/DEVELOPMENT.md) をご確認ください。

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

