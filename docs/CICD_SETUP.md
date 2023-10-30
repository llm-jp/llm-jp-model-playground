# GitHub Actions を用いたCI/CDの設定方法

## 前提条件
- [README.md/デプロイ](../README.md#デプロイ) 内の `npx -w packages/cdk cdk bootstrap` の完了
- 上記のコマンドが正常に実行されると、cdk がリソースの作成に利用する IAM Role が作成されます。

## GitHub Actions で利用する AWS 権限の設定

本レポジトリで利用されている GitHUb Actions の CI/CD では、AWS のリソース作成時に利用する権限を、OIDC (OpenID Connect) 連携にて GitHub Actions の実行環境に渡しています。

以下ではその設定について説明します。詳細は [GitHub のドキュメント](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)や [AWS のドキュメント](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)をご参照ください。

### AWS Identity and Access Management (AWS Identity and Access Management) の　IP プロバイダの作成

AWS マネジメントコンソールの検索画面で、IAM を検索、選択します。

ダッシュボードの左側のメニュー (閉じていたら三本線をクリックして開いてください。)から、🔽アクセス管理から、ID プロバイダを選択します。

「プロバイダを追加」をクリックします。

遷移後の画面にて、項目をそれぞれ以下のように入力します。
- プロバイダのタイプ: OpenID Connect をチェック
- プロバイダの URL: https://token.actions.githubusercontent.com
- プロバイダの URL 入力後、その横にある「サムプリントを取得」をクリック
- 対象者: sts.amazonaws.com

入力したら、「プロバイダを追加」をクリックします。


### ID プロバイダに割り当てる IAM Role の作成
上記の手順が完了した際に、コンソール上部にポップアップが現れるので、「ロールの割り当て」をクリックし、「新しいロールを作成」にチェックを入れて、「次へ」をクリックします。

項目をそれぞれ以下のように入力します。

- 信頼されたエンティティタイプ: ウェブアイデンティティ
- ウェブアイデンティティ:
  - アイデンティティプロバイダー: 前の手順でプロバイダの URL に指定した 「token.actions.githubusercontent.com」を選択
  - Audience: 前の手順で対象者に選択した「sts.amazonaws.com」を選択
  - GitHub 組織: 利用する GitHub のアカウント名
  - GitHub リポジトリ: 利用する GitHub のレポジトリ名 (オプション)
  - GitHub ブランチ: 利用する GitHub レポジトリのブランチ名 (オプション)

  入力後、「ロールを作成」をクリックして次の画面に移ります。

  許可を追加の場面では今は何もせず、そのまま「次へ」をクリックします。

  ロール名をとして `GitHubOidcRole` を入力し 、「ロールを作成」をクリックします。

  作成後、ロールを表示し、許可ポリシーの「許可を追加 🔽」から「インラインポリシーを作成」を選択します。ポリシーエディタで `JSON` を選択して以下の内容を貼り付けます。`<AWS_ACCOUNT_ID>` 部分は置き換えてください。また、下記ポリシーでも動作しますが、内容は適切に絞ってください。

  ```json

  {
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Statement1",
			"Effect": "Allow",
			"Action": "sts:AssumeRole",
			"Resource": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/cdk-*"
		}
	]
  }

「次へ」をクリックして、ポリシーの詳細画面でポリシー名を `GitHubOidcPolicy` と入力します。「ポリシーを作成」をクリックします。


## GitHub 側での設定

### パラメータの作成
GitHub のレポジトリにて、Setting タブを選択します。
遷移後、左側のメニュー下部にある 「Secrets and Valuable 🔽」から、「Actions」を選択します。

遷移後の画面だと 「Secrets」 タブが選択されているので、「Variables」に切り替えます。右側の「New Repository Variable」をクリックします。
以下のように入力します。

- Name: `AWS_OIDC_ROLE_ARN`
- Value: `arn:aws:iam::<AWS_ACCOUNT_ID>:role/GitHubOidcRole`
  - <AWS_ACCOUNT_ID>は置き換えてください
  - OIDC 用の Role 名に `GitHubOidcRole` 以外を入力した場合は、適宜読み替えてください。





--- 

以上で設定は完了です。これで ワークフロー内で処理を記述して、GitHub Actions から OIDC 連携にて、IAM Role を引き受けて、AWS へリソースをデプロイできます。
