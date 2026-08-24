# 画像の出典

構造の説明図は CSS と `src/components/Icon.tsx` のアイコンです。ここに置くのは、申請くんの画面キャプチャです。

## 申請くんの画面キャプチャ

教材用サンプル `shinsei-kun/` の画面です。ログイン・一覧・詳細・承認 500・業務メッセージは起動中のアプリから撮影しています。実行中に作りにくい一部の見え方には、`src/main/resources/static/demo/` のモック HTML を使います。画面の再撮影は `shinsei-kun/scripts/capture-screens.mjs`、Network タブは `capture-network.mjs` です。

| ファイル | 出典 |
| --- | --- |
| `screen-login.jpg` | 申請くん GET `/shinsei/login` |
| `screen-login-error.jpg` | 申請くん ログイン失敗 |
| `screen-list.jpg` | 申請くん GET `/shinsei/requests`（山田太郎） |
| `screen-detail.jpg` | 申請くん GET `/shinsei/requests/12` |
| `screen-not-found.jpg` | 申請くん GET `/shinsei/requests/99999` |
| `screen-forbidden.jpg` | モック `demo/forbidden.html`（承認権限が無いときの画面） |
| `screen-error-500.jpg` | 申請くん POST `/shinsei/requests/16/approve`（研修参加、承認者 NULL、500） |
| `screen-cannot-approve.jpg` | 申請くん POST `/shinsei/requests/11/approve` 後の詳細画面 |
| `screen-list-empty.jpg` | モック `demo/list-empty.html` |
| `screen-list-unstyled.jpg` | モック `demo/list-unstyled.html` |
| `screen-network-rows.jpg` | 申請くん GET `/shinsei/requests` の Network タブ（HTML / CSS / JS の行） |
| `screen-network-css-404.jpg` | 申請くん一覧で `app.css` が 404 の Network タブ |
| `screen-network-no-post.jpg` | 申請くん一覧で承認を押した直後（POST 無し）の Network タブ |
| `screen-network-js-error.jpg` | 申請くん一覧で画面にエラーが出ているが POST が無い Network タブ |
| `screen-network-403.jpg` | 申請くん POST `/shinsei/requests/12/approve`（山田、403）の Network タブ |
| `screen-network-500.jpg` | 申請くん POST `/shinsei/requests/16/approve`（研修参加、承認者 NULL、500）の Network タブ |
| `screen-network-pending.jpg` | HTML のリクエストを終わらせない Network タブ |

## 図のアイコン（インライン SVG）

`src/components/Icon.tsx` のストロークアイコンは、[SVG Repo](https://www.svgrepo.com/collections/monocolor/) の monocolor 系（CC0）を参考にしています。ファイルとしては置かず、教材用に簡略化したパスをコンポーネント内に持ちます。
