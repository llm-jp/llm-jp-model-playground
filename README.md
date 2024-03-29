# LLM JP Model Playground

本リポジトリでは、大規模言語モデルのプレイグラウンドを AWS で実装するためのコードを提供します。プレイグラウンドでは、プロンプトやパラメーターを変更した際のモデルの挙動を確認、記録することができます。

![sc_lp.png](/imgs/sc_lp.png)

## 機能一覧

> :white_check_mark: ... 実装されている、:construction: ... まだ実装されていない

- :white_check_mark: プロンプト / パラメーター入力、出力表示用 UI
- :construction: Fine-tuning 用のデータ収集
- :construction: Fine-tuning 用データのラベリング
- :construction: Fine-tuning の実行

## アーキテクチャ

プレイグラウンドのフロントエンドは [React](https://ja.react.dev/) で実装されています。静的ファイルは Amazon S3 に配置され、 Amazon CloudFront で配信されます。バックエンドの API は Amazon API Gateway + AWS Lambda で実装され、認証は Amazon Congito で行っています。チャット履歴等の保存には Amazon DynamoDB を使用しています。大規模言語モデルは Amazon SageMaker でホスティングしています。

![arch.png](/imgs/arch.png)

## デプロイ

本リポジトリのアプリケーションをデプロイするのに [AWS Cloud Development Kit](https://aws.amazon.com/jp/cdk/)（以降 CDK）が必要です。各環境での CDK のインストール方法は [AWS CDK Workshop](https://cdkworkshop.com/ja/15-prerequisites/100-awscli.html) の「必要条件」を参照ください。本リポジトリでは TypeScript を使っているため、 Python/.NET/Java/Go の環境構築は必要ありません。

リモートの環境を使用することで、お手元の PC に影響を与えずデプロイすることができます。 AWS のリモート開発環境である Cloud9 を使用したデプロイ方法については[動画](https://youtu.be/9sMA17OKP1k?si=XwEp7q6b_EXDBP3p)にまとめていますので、そちらを参考にデプロイしてください。

CDK のインストールができたらデプロイを開始します。はじめに、デプロイする AWS のリージョンを設定します。 GPU インスタンス (`g5.2xlarge` など ) に余裕がある `us-west-2` を推奨します。

Mac/Linux

```bash
export AWS_DEFAULT_REGION=us-west-2
```

Windows
```bash
set AWS_DEFAULT_REGION=us-west-2
```

本アプリケーションに必要な `npm` のパッケージをインストールします。

```bash
npm ci
```

CDK を利用したことがない場合、初回のみ CDK 用のファイルを保存する Amazon S3 やデプロイに必要なアクセス権限を付与する IAM ロールを準備する [Bootstrap](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/bootstrapping.html) 作業が必要です。すでに Bootstrap された環境では以下のコマンドは不要です。

```bash
npx -w packages/cdk cdk bootstrap
```

続いて、以下のコマンドで AWS リソースをデプロイします。デプロイが完了するまで、お待ちください（20 分程度かかる場合があります）。

```bash
npm run cdk:deploy
```

> [!NOTE]
> 開発環境を構築する際は、本番環境を上書きしないよう `-c` で `stage` を使用してください。
> ```bash
> npm run cdk:deploy -- -c stage=<stage>
> ```

アプリケーションのデプロイが完了したら、コンソールに出力される `WebUrl` の URL からアクセスしてください。コンソールの出力をとり漏らした場合は、  AWS Console にログインし次の手順で確認してください。

1. 画面上部の検索バーで "CloudFormation" を検索し、 CloudFormation の管理画面に遷移。
   * この時、 AWS のリージョンが CDK deploy したリージョンで同じであることを確認してください。
2. 左側のメニューから「スタック」を選択。メインパネルに表示されたスタックの一覧から "GenerativeAiUseCasesStack" を選択。
3. 画面右にスタックの情報が出力される。「出力」のタブからキーが "WebUrl" になっているものを探すと、値の箇所に URL が記載されている。

URL にアクセスするとログイン画面に遷移します。アカウントを作成する際は、 AWS Console にアクセスし次の手順で作成してください。

### アカウント作成手順

1. 画面上部の検索バーで "Cognito" を検索し、 Amazon Cognito の管理画面に遷移。
   * この時、 AWS のリージョンが CDK deploy したリージョンで同じであることを確認してください。
2. ユーザープールを選択
   * ユーザープールが複数ある場合は、上述の `WebUrl` の特定方法をなぞりキーが `UserPoolId` の値を確認し、ユーザープール ID が確認した値と一致するものを選択してください。
3. 「ユーザー」のタブから「ユーザーを作成」を押す。
4. E メールアドレス、パスワードを入力し「ユーザーを作成」を押す。
   * パスワードを E メールで連絡したい場合は、「 E メールで招待を送信」を選択してください。それ以外の場合、 Slack の DM など個別の方法で送ってください。

### プレイグラウンドの利用方法

下記動画を参考にしてください。エンドポイントが起動していない場合は差最初に起動する必要があります。起動したエンドポイントは、リクエストがない場合自動的に停止します。

![playground.gif](./imgs/playground.gif)

## 開発

本アプリケーションを修正する場合、 [DEVELOPMENT.md](docs/DEVELOPMENT.md) を参照し開発環境を構築してください。修正内容を本リポジトリに送っていただける場合は、 [CONTRIBUTING](CONTRIBUTING.md) を参照ください。

次のボードを参照することで、バグ・追加要望の対応状況を参照することができます。

[llmjp playground development board](https://github.com/orgs/llm-jp/projects/3)

### Release History

太字は終了した Release です。

* 0.5.0 : プレイグラウンドから Fine Tuning したモデルに対しプロンプト / パラメーターの入出力ができるようにする
* 0.4.0 : プレイグラウンドから Fine Tuning を実行できるようにする
* 0.3.0 : プレイグラウンド上でデータの参照・修正機能を実装する
* 0.2.0 : プレイグラウンド上でのデータ収集機能を実装する
* [0.1.1](https://github.com/llm-jp/llm-jp-model-playground/milestone/2) : 新規開発メンバーが過大な請求や障害を起こすことなく開発できるガイド、仕組みを整える。
* [0.1.0](https://github.com/llm-jp/llm-jp-model-playground/milestone/1) : プロンプト / パラメーター入力、出力表示用 UI を実装する。

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
