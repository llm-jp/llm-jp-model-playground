## セルフサインアップを有効化する

このソリューションはデフォルトでセルフサインアップが無効化してあります。セルフサインアップを有効にするには、[cdk.json](./packages/cdk/cdk.json)を開き、`selfSignUpEnabled` を `true` に切り替えてから再デプロイしてください。

```json
  "context": {
    "ragEnabled": false,
    "selfSignUpEnabled": false, // false -> true で有効化
    "@aws-cdk/aws-lambda:recognizeLayerVersion": true, 
```