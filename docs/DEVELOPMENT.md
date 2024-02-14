# プレイグラウンド環境構築手順

開発者用にローカル環境を構築する手順を説明します。

## 事前知識インプット

AWS が初めての場合、 AWS 、特に本プレイグラウンドで利用している AWS のサービスについて一通り理解しておくことを推奨します。 AWS に触れるのは今回が初めて、という場合は [AWS Certified Solutions Architect – Associate 認定](https://aws.amazon.com/jp/certification/certified-solutions-architect-associate/) の資格取得を検討ください。勉強になるのはもちろん、 2022 年で取りたい資格 No.1 になっているので今後のキャリアにとって損はないと思います。

勉強のための資料は次の資料をご参照ください。

* [第一回 : AWS 基礎トレーニング](https://speakerdeck.com/icoxfog417/aws-ji-chu-toreningu-at-llm-mian-qiang-hui)

フロントエンドの構築に利用している React については、 React の公式ドキュメントが非常に丁寧に書かれているので一通り流してみてください。

* [React](https://ja.react.dev/)

## 開発環境構築

開発に使用する環境を整えます。以降の手順は手元の PC での構築を前提にしていますが、 Cloud9 などリモートの環境を使用することで、お手元の PC に影響を与えずデプロイすることができます。 Cloud9 を使用したデプロイ方法については[動画](https://youtu.be/9sMA17OKP1k?si=XwEp7q6b_EXDBP3p)にまとめていますので、そちらを参考にセットアップを行ってください。

1 から 4 の手順を踏むことで、開発環境を構築し修正を送る手続きが確認できます。

### 1.AWS 環境に接続する

プレイグラウンドをデプロイする AWS アカウントにアクセス可能なユーザーを作成し、そのユーザーで AWS アカウントにアクセスできることを確認してください。プレイグラウンドは  [AWS Cloud Development Kit](https://aws.amazon.com/jp/cdk/)（以降 CDK）を使いデプロイするため実行の権限が必要です。

#### 1.1 権限の設定

プレイグラウンドのデプロイに必要な権限の設定例を示します。ユーザーグループとして設定しておくと複数ユーザーへの権限付与が容易になります。

* AmazonDynamoDBReadOnlyAccess
* AWSLambda_ReadOnlyAccess
* CloudWatchReadOnlyAccess
* CdkDeploy (※カスタム)
* CreateUserAccessKey (※カスタム)

CdkDeploy の設定
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AssumeCDKRoles",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "*",
            "Condition": {
                "ForAnyValue:StringEquals": {
                    "iam:ResourceTag/aws-cdk:bootstrap-role": [
                        "image-publishing",
                        "file-publishing",
                        "deploy",
                        "lookup"
                    ]
                }
            }
        }
    ]
}
```

CreateUserAccessKey の設定
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:ListUsers",
                "iam:GetAccountPasswordPolicy"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:*AccessKey*",
                "iam:ChangePassword",
                "iam:GetUser"
            ],
            "Resource": [
                "arn:aws:iam::*:user/${aws:username}"
            ]
        }
    ]
}
```

#### 1.2 権限の設定

AWS のユーザーを作成したら、 [AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-welcome.html) を使い AWS にアクセスできるか確認してください。

手順は次の記事などを参考にしてください。

* [【AWS】aws cliの設定方法](https://zenn.dev/akkie1030/articles/aws-cli-setup-tutorial)
* [AWS CLI初期設定手順（Linux）](https://blog.serverworks.co.jp/2023/08/25/150000)

※ LLM 勉強会の AWS アカウントで開発する際は、開発環境のリージョンは東京 (`ap-northeast-1`) としてください。

#### Checkpoint:1

* デプロイしたい AWS アカウントにアクセス可能な IAM ユーザーが作成できている。
* 作成した IAM ユーザーの認証情報を使い、 AWS アカウントにアクセスできることを確認した。
   * 開発環境のリージョンは東京 (`ap-northeast-1`) としてください。

### 2.ソースコードをダウンロードする

プレイグラウンドのリポジトリからソースコードをダウンロードします。

```
git clone https://github.com/llm-jp/llm-jp-model-playground.git
```

Git のインストール方法や使い方は下記を参照してください

* [使い始める Git](https://qiita.com/icoxfog417/items/617094c6f9018149f41f)

GitHub を使う場合、 GitHub CLU だとクレデンシャルの設定なのが非常に容易なためこちらを使うことを推奨します。

* [GitHub CLI クイックスタート](https://docs.github.com/ja/github-cli/github-cli/quickstart)

#### Checkpoint:2

* Git を用い、開発環境にソースコードがダウンロードできている。

### 3. アプリケーションの動作確認

CDK を用い自身の開発環境にデプロイを行い、動作確認をします。

#### 3.1 CDK のインストール

各環境での CDK のインストール方法は [AWS CDK Workshop](https://cdkworkshop.com/ja/15-prerequisites/100-awscli.html) の「必要条件」を参照ください。本リポジトリでは TypeScript を使っているため、 Python/.NET/Java/Go の環境構築は必要ありません。

#### 3.2 CDK によるデプロイ

CDK のインストールができたらデプロイを開始します。ターミナルを開き、 `git clone` したフォルダまで異動していることを確認したのち次の手順を実行してください。

LLM 勉強会の AWS アカウントで開発する際は、開発環境のリージョンは東京 (`ap-northeast-1`) としてください。

Mac/Linux

```bash
export AWS_DEFAULT_REGION=ap-northeast-1
```

Windows
```bash
set AWS_DEFAULT_REGION=ap-northeast-1
```

次に、本アプリケーションに必要な `npm` のパッケージをインストールします。

```bash
npm ci
```

CDK を利用したことがない場合、初回のみ CDK 用のファイルを保存する Amazon S3 やデプロイに必要なアクセス権限を付与する IAM ロールを準備する [Bootstrap](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/bootstrapping.html) 作業が必要です。すでに Bootstrap された環境では以下のコマンドは不要です。

```bash
npx -w packages/cdk cdk bootstrap
```

続いて、以下のコマンドで AWS リソースをデプロイします。デプロイが完了するまで、お待ちください（20 分程度かかる場合があります）。 LLM 勉強会のアカウントで作業する場合、 `<stage>` にはご自身のユーザー ID を設定してください。デプロイ先が重複しないようにするために必要です。

```bash
npm run cdk:deploy -- -c stage=<stage>
```

アプリケーションのデプロイが完了したら、コンソールに出力される `WebUrl` の URL からアクセスしてください。コンソールの出力をとり漏らした場合は、  AWS Console にログインし次の手順で確認してください。

1. 画面上部の検索バーで "CloudFormation" を検索し、 CloudFormation の管理画面に遷移。
   * この時、 AWS のリージョンが CDK deploy したリージョンで同じであることを確認してください。
2. 左側のメニューから「スタック」を選択。メインパネルに表示されたスタックの一覧から "GenerativeAiUseCasesStack" を選択。
3. 画面右にスタックの情報が出力される。「出力」のタブからキーが "WebUrl" になっているものを探すと、値の箇所に URL が記載されている。

URL にアクセスするとログイン画面に遷移します。

#### 3.3 フロントエンドの開発

構築した開発閑居でアプリケーションを実行し開発する方法を示します。

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

正常に実行されれば http://localhost:8080 で起動しますので、ブラウザからアクセスしてみてください。プレイグラウンドの内部に入るためにはプレイグラウンドのアカウントが必要です。作成する手順は [README.md](../README.md) の「アカウント作成手順」を参照してください。

#### 3.4 バックエンドの開発

次にバックエンドを開発する時の方法を示します。

**CDK Watch**

CDK ではバックエンドの変更をリアルタイムにデプロイし反映させることが可能です。

```
npm run cdk:watch
```

環境を指定する際は、`-c` で `stage` を使用してください。

```bash
npm run cdk:watch -- -c stage=<stage>
```

裏ではファイルの変更がモニタされ Lambda への変更はホットスワップデプロイが実行され、CDK の更新なしにバックエンドにデプロイすることが可能です。その他の変更は通常の CloudFormation の完全なデプロイにフォールバックします。
詳細ついては [CDK Workshop](https://cdkworkshop.com/ja/20-typescript/30-hello-cdk/300-cdk-watch.html#cdk-watch) をご確認ください。

#### 3.5 モデルの動作確認

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

#### Checkpoint:3

* CDK をインストールし、プレイグラウンドがデプロイできることを確認した。
* フロントエンドの動作確認を行った。
* バックエンドの動作確認を行った。
* モデルの追加手順を確認した。

### 4. 修正を本番環境に反映する

修正した内容を本番環境に反映する手順は次の通りです。

1. 修正を行う
2. 動作検証のために、個人環境にデプロイをする
   * `aws configure` で、デフォルト `region` を開発環境のリージョン (tokyo) に設定
   * `cdk deploy` する際に、自分のAWSユーザー名を context で指定する (忘れても別 region なので本番が修正されることはない)。
3. 動作検証を実施
4. `main` ブランチに PR を作成する
5. レビュアーは、自分の環境に PR のコードをデプロイして動作確認をする。
6. PR がマージされる
7. マージされると本番環境に自動デプロイされる

#### Checkpoint:4

* 修正を行う手順を確認した。
* Pull Request を作成できた。
* マージ後、本番環境に修正が反映されることを確認した。

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
