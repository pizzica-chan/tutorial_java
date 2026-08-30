# 参画前に知っておきたい Java Web アプリ

Java Web アプリを、処理の入口から追い、リクエストがどこまで届いたかで切り分ける静的サイトです。ゼロからアプリを作る入門ではありません。

コード例は架空の申請アプリ「申請くん」（Spring Boot / Thymeleaf / MyBatis / MySQL / Spring Security）です。動くソースは `shinsei-kun/` にあります。起動方法は `shinsei-kun/README.md` です。

- バックエンド処理はありません。静的ファイルだけです
- Cloudflare の無料枠（Workers の静的アセット、または Pages）で公開できます
- npm パッケージ名は `genba-trace` です。画面上の名前は「参画前に知っておきたい Java Web アプリ」です

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

Cloudflare Pages を使う場合は、ビルドコマンド `npm run build`、出力ディレクトリ `dist` を指定してください。`wrangler.jsonc` の `not_found_handling` は Workers 静的アセット専用で Pages には効かないので、Pages 側で `/tracks/web/letter` のような個別 URL を直接開くと 404 になります。SPA として使うなら、`dist/` に `_redirects`（`/* /index.html 200`）を別途追加してください。このファイルをリポジトリの `public/` に置くと、Workers 経由の `npm run deploy` 側で `not_found_handling` と衝突してデプロイに失敗するため、リポジトリには含めていません。

アカウントなしで一時公開するなら、ビルド後の `dist/` を [Cloudflare Drop](https://cloudflare.com/drop) にアップロードする方法もあります。

## 構成

| 章 | 内容 |
| --- | --- |
| はじめに | この教材について |
| Webの基礎 | URL、ステータスコード、Cookie など、HTTP の読み方を身につけます |
| Javaアプリの構成 | リポジトリを開いたとき、ファイルと層の役割が分かるようにします |
| ソースの読み方 | 通読せず、手がかりから処理の入口と呼び出しを追います |
| リクエストの追跡 | 処理の入口から SQL と応答まで、一本の線で追います |
| トラブルシューティング手法 | いきなりソースを読まず、リクエストがどこまで届いたかと症状から当たりをつけます |
| 実務のシナリオ | シナリオを想定し、より実践的な調査の進め方を学びます |
| ラボ | HTTP、ソース、リクエストの区間、スタックトレース |
| 用語集 | 本文の点線から飛ぶ用語 |
