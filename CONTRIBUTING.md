# Contributing Guidelines

プレイグラウンドの開発への協力に関心を持っていただきありがとうございます。バグの報告、新機能の提案、それらの修正 / 実装、またドキュメントの充実にはコミュニティからの貢献が大きな力となります。

Issue や Pull Request を送信する前にこのドキュメントをよく読み、必要な情報がすべて揃っていることを確認してください。

## Issue でバグの報告や新機能の提案を行う

GitHub Issue を使用してバグを報告したり、新機能を提案したりすることを歓迎します。 Issue を起票する前に既存または解決済みの Issue を探すことで解決策が得られることがあるので、事前に確認をしてください。もしこれまで議論されておらず解決もされていない場合、  Issue Template に従い起票をしてください。できるだけ多くの情報を含めるようにしてください。次のような詳細は非常に役立ちます。

* 再現可能なテストケースまたは一連のステップ
* 使用しているコードのバージョン
* バグに関連して行った変更
* 環境または展開に関する異常な点

## Pull Request で貢献する

Pull Request による貢献は大歓迎です。 Pull Request を送信する前に、次のことを確認してください。

1. *main* ブランチ上の最新のソースに対して作業しています。
2. 既存の Pull Request をチェックして、他の人がまだ問題に対処していないことを確認します。
3. 重要な作業について話し合うために Issue を開きます。あなたの時間を無駄にすることは望ましくありません。

次のボードを参照することで、バグ・追加要望の対応状況を参照することができます。

[llmjp playground development board](https://github.com/orgs/llm-jp/projects/3)

Pull Request を送信するには、次の手順を実行してください。開発環境の構築は [DEVELOPMENT.md](docs/DEVELOPMENT.md) を参照してください。

1. 本リポジトリを Fork します (Commit 権限がある場合 Clone で構いません) 。
   * 参考 : [forking a repository](https://help.github.com/articles/fork-a-repo/)
2. ソースを変更します。あなたが提案する修正に集中し変更してください。すべてのコードを再フォーマットしたりすると、変更に焦点を当てることが難しくなります。
3. ローカルでのテストにパスすることを確認します。
   * ソースコードの成形 : `npm run lint`
4. 変更内容が明確なコミットメッセージでコミットし、 Fork したリポジトリに push します。
5. Fork したリポジトリの Pull Request の画面から、本リポジトリの `main` ブランチに対し Pull Request を作成します。
   * [**DynamoDB のスキーマ構造を変える時はバックアップを取得してください**](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/BackupRestore.html)
6. Pull Request に対しレビューを受けます。レビューが完了したらマージを行います。
   * CI/CD の仕組みに関心ある場合は [CICD Setup](./docs/CICD_SETUP.md) をご参照ください。

GitHub のガイドも参考にしてください [pull request の作成](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

## 貢献できる Issue を見つける

[`good first issue` がついた Issue ](https://github.com/llm-jp/llm-jp-model-playground/labels/good%20first%20issue) は最初の貢献に適しています。自身に AWS やアプリケーション開発の知見がある場合、 `help wanted` がついた Issue をぜひサポートしてください。

## 行動規範

本プロジェクトの行動規範は、 [CONTRIBUTOR COVENANT CODE OF CONDUCT 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) に基づきます。行動規範への違反を見つけた場合や規範に関する質問は `llm-jp@nii.ac.jp` までご連絡ください。

## セキュリティの報告について

本プロジェクトについてセキュリティの脆弱性などを発見した場合は、 `llm-jp@nii.ac.jp` までご連絡ください。**決して Public な Issue で報告しないでください**

## ライセンス

本プロジェクトのライセンスは [LICENSE](LICENSE) を参照してください。本プロジェクトへの貢献を行う際は、このライセンスの範囲内で利用可能なものであるかご確認をお願いいたします。例えば、本プロジェクトのライセンスよりも Limited なライセンスのソフトウェアやコードを含めることはできません。
