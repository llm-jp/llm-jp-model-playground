# プレイグラウンド環境構築手順

開発者用にローカル環境を構築する手順を説明します。

## 事前知識インプット

AWS が初めての場合、 AWS 、特に本プレイグラウンドで利用している AWS のサービスについて一通り理解しておくことを推奨します。 AWS に触れるのは今回が初めて、という場合は [AWS Certified Solutions Architect – Associate 認定](https://aws.amazon.com/jp/certification/certified-solutions-architect-associate/) の資格取得を検討ください。勉強になるのはもちろん、 2022 年で取りたい資格 No.1 になっているので今後のキャリアにとって損はないと思います。

勉強のための資料は次の資料をご参照ください。

* (準備中)

フロントエンドの構築に利用している React については、 React の公式ドキュメントが非常に丁寧に書かれているので一通り流してみてください。

* [React](https://ja.react.dev/)

## 開発環境構築

[README.md](../README.md) のデプロイのセクションのセットアップを行ってください。

### フロントエンドの動作確認

次に、ローカルでアプリケーションの動作確認をする方法を示します。

**Unix 系コマンドが使えるユーザー (Linux, MacOS 等)**

```bash
npm run web:devw
```

**その他のユーザー (Windows 等)**

デプロイ完了時に表示される Outputs から API の Endpoint (Output key = APIApiEndpoint...)、Cognito User Pool ID (Output key = AuthUserPoolId...)、Cognito User Pool Client ID (Output Key = AuthUserPoolClientId...) 、Cognito Identity Pool ID (Output Key = AuthIdPoolId...)、レスポンスストリーミングの Lambda 関数の ARN (Output Key = APIPredictStreamFunctionArn...) を取得します。

デプロイ時の出力が消えている場合、[CloudFormation](https://console.aws.amazon.com/cloudformation/home) の GenerativeAiUseCasesStack をクリックして Outputs タブから確認できます。
それらの値を以下のように環境変数に設定してください。

```bash
export VITE_APP_API_ENDPOINT=<API Endpoint>
export VITE_APP_USER_POOL_ID=<Cognito User Pool ID>
export VITE_APP_USER_POOL_CLIENT_ID=<Cognito User Pool Client ID>
export VITE_APP_IDENTITY_POOL_ID=<Cognito Identity Pool ID>
export VITE_APP_PREDICT_STREAM_FUNCTION_ARN=<Function ARN>
export VITE_APP_REGION=<デプロイしたリージョン>
```

具体例は以下です。

```bash
export VITE_APP_API_ENDPOINT=https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/api/
export VITE_APP_USER_POOL_ID=ap-northeast-1_xxxxxxxxx
export VITE_APP_USER_POOL_CLIENT_ID=abcdefghijklmnopqrstuvwxyz
export VITE_APP_IDENTITY_POOL_ID=ap-northeast-1:xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx
export VITE_APP_PREDICT_STREAM_FUNCTION_ARN=arn:aws:lambda:ap-northeast-1:000000000000:function:FunctionName
export VITE_APP_REGION=ap-northeast-1
```

続いて以下のコマンドを実行します。

```bash
npm run web:dev
```

正常に実行されれば http://localhost:8080 で起動しますので、ブラウザからアクセスしてみてください。

### バックエンドの動作確認

* (`lambda` の動作確認方法について記載)

### モデルの動作確認

プレイグラウンドで扱えるモデルは、 Amazon SageMaker にデプロイしています。具体的には、 Deep Java Library (DJL) を使用した SageMaker Endpoint に対応しています。

* (SageMaker Endpoint の動作確認方法について記載)

**モデルの変更の反映は、一度落として再起動しないと反映されないので注意してください**

#### モデルの追加手順

1. `packages/cdk/models` に新しいフォルダを追加し `serving.properties` を追加する。
    1. 他のモデルを参考にパラメータを変更してください
    2. DJL のパラメータの設定の仕方や Dependency の追加、推論コードのオーバーライド方法については [ドキュメント](https://sagemaker.readthedocs.io/en/stable/frameworks/djl/using_djl.html)をご確認ください。
2. `./package_models.sh` を実行し、設定ファイルを圧縮する (SageMaker CDK で対応しているのが `tar` ファイルのみのため) 。
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

## その他設定

### セルフサインアップを有効化する

このソリューションはデフォルトでセルフサインアップが無効化してあります。セルフサインアップを有効にするには、[cdk.json](./packages/cdk/cdk.json)を開き、`selfSignUpEnabled` を `true` に切り替えてから再デプロイしてください。

```json
  "context": {
    "ragEnabled": false,
    "selfSignUpEnabled": false, // false -> true で有効化
    "@aws-cdk/aws-lambda:recognizeLayerVersion": true, 
```

### CI/CD の設定

このレポジトリで GitHub Actions を用いた CI/CD を利用する場合、用意されている Cloudformation テンプレートを利用して IAM 関連のセットアップを
自動で行うことができます。レポジトリを Clone したディレクトリにて、 `GitHub_ORG_NAME` と `GitHub_REPO_NAME` を適切に設定して以下のコマンドを実行してください。
※ コマンドの実行には適切な権限が必要です。

```bash
stack_name="oidc-setup" 
aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --stack-name $stack_name --template-body file://oidc-setup.yaml --parameters ParameterKey=GithubOrg,ParameterValue=<GitHub_ORG_NAME> ParameterKey=RepoName,ParameterValue=<GitHub_REPO_NAME>

aws cloudformation wait stack-create-complete --stack-name $stack_name

outputs=$(aws cloudformation describe-stacks --stack-name $stack_name --query 'Stacks[0].Outputs' --output text)

echo "Stack Outputs:"
echo "$outputs" 
```
実行したターミナルに IAM Role の arn が出力されます。この後の手順で必要になるので、メモしておきます。
追加で GitHub 側での設定が必要です。追加の手続きは [/docs/CICD_SETUP.md](docs/CICD_SETUP.md##GitHub-側での設定) をご確認ください。
