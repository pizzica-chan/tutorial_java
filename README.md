# Java Web の読み方

Java Web アプリの基礎と、症状別の切り分けを学ぶ静的サイトです。ゼロからアプリを作る入門ではありません。

コード例は架空の申請アプリ「申請くん」（Spring Boot / Thymeleaf / MyBatis / MySQL / Spring Security）です。動くソースは `shinsei-kun/` にあります。起動方法は `shinsei-kun/README.md` です。

- バックエンド処理はありません。静的ファイルだけです
- 読了進捗はブラウザの `localStorage` にだけ保存されます
- Cloudflare の無料枠（Workers の静的アセット、または Pages）で公開できます
- npm パッケージ名は `genba-trace` です。画面上の名前は「Java Web の読み方」です

## ローカルで見る

```bash
npm install
npm run dev
```

ブラウザで表示される URL を開きます。

## ビルド

```bash
npm run build
```

成果物は `dist/` です。このフォルダをそのまま静的ホスティングに置けます。

教材・クイズ・画像の参照がつながっているかは、次でも確認できます。

```bash
npm run check
```

## Cloudflare へ公開

事前に [Wrangler](https://developers.cloudflare.com/workers/wrangler/) でログインします。

```bash
npx wrangler login
npm run deploy
```

`wrangler.jsonc` は Worker スクリプトなしの静的配信です。SPA のため、存在しないパスは `index.html` にフォールバックします。

Cloudflare Pages を使う場合は、ビルドコマンド `npm run build`、出力ディレクトリ `dist` を指定してください。

アカウントなしで一時公開するなら、ビルド後の `dist/` を [Cloudflare Drop](https://cloudflare.com/drop) にアップロードする方法もあります。

## 構成

| 章 | 内容 |
| --- | --- |
| はじめに | 想定読者、申請くん、この教材でやること |
| Webの基礎 | HTTP、パラメータ、ステータスコード、Cookie、HTML / CSS / JS の役割 |
| Javaアプリの構成 | ディレクトリ、設定、層、テンプレートの読み方、Filter / Interceptor / AOP |
| ソースの読み方 | どこから読み始めるか、処理の入口、キーワード検索、正規表現、デバッガ |
| リクエストの追跡 | 画面から SQL まで |
| トラブルシューティング手法 | 調査手順、ログの場所、ネットワーク疎通、どこまで届いたか、アプリのログで処理を追う、症状別の切り分け |
| 実務のシナリオで追う | 障害対応と改修の影響調査 |
| ラボ | 対話ウィジェット |
