# 画像の出典

教材へ再利用できるフリー素材です。トリミングと彩度の調整をしています。

| ファイル | 出典 | 作者 | ライセンス |
| --- | --- | --- | --- |
| `client-laptop.jpg` | [Unsplash](https://unsplash.com/photos/xG8IQMqMITI) | Christopher Gower | [Unsplash License](https://unsplash.com/license) |
| `server-racks.jpg` | [Unsplash](https://unsplash.com/photos/8IKf54pc3qk) | Taylor Vick | Unsplash License |
| `home-desk.jpg` | [Unsplash](https://unsplash.com/photos/npxXWgQ33ZQ) | Glenn Carstens-Peters | Unsplash License |
| `code-screen.jpg` | [Unsplash](https://unsplash.com/photos/w7ZyuGYNpRQ) | Kevin Ku | Unsplash License |
| `keys.jpg` | [Pexels](https://www.pexels.com/photo/gold-padlock-locking-door-164425/) | Pixabay | [Pexels License](https://www.pexels.com/license/) |
| `storage-racks.jpg` | [Pexels](https://www.pexels.com/photo/close-up-photo-of-mining-rig-1148820/) | panumas nikhomkhai | Pexels License |

## 申請くんの画面キャプチャ

教材用サンプル `shinsei-kun/` の画面です。ログイン・一覧・詳細は起動中のアプリから、不具合の見え方は `src/main/resources/static/demo/` のモック HTML から撮影しています。画面の再撮影は `shinsei-kun/scripts/capture-screens.mjs`、Network タブは `capture-network.mjs` です。

| ファイル | 出典 |
| --- | --- |
| `screen-login.jpg` | 申請くん GET `/shinsei/login` |
| `screen-login-error.jpg` | 申請くん ログイン失敗 |
| `screen-list.jpg` | 申請くん GET `/shinsei/requests`（山田太郎） |
| `screen-detail.jpg` | 申請くん GET `/shinsei/requests/12` |
| `screen-not-found.jpg` | 申請くん GET `/shinsei/requests/99999` |
| `screen-forbidden.jpg` | モック `demo/forbidden.html`（承認権限が無いときの画面） |
| `screen-error-500.jpg` | モック `demo/error-500.html` |
| `screen-cannot-approve.jpg` | モック `demo/cannot-approve.html` |
| `screen-list-empty.jpg` | モック `demo/list-empty.html` |
| `screen-list-unstyled.jpg` | モック `demo/list-unstyled.html` |
| `screen-network-list.jpg` | 申請くん GET `/shinsei/requests` の Network タブ |
| `screen-network-rows.jpg` | 申請くん GET `/shinsei/requests` の Network タブ（HTML / CSS / JS の行） |
| `screen-network-css-404.jpg` | 申請くん一覧で `app.css` が 404 の Network タブ |
| `screen-network-no-post.jpg` | 申請くん一覧で承認を押した直後（POST 無し）の Network タブ |
| `screen-network-js-error.jpg` | 申請くん一覧で画面にエラーが出ているが POST が無い Network タブ |
| `screen-network-403.jpg` | 申請くん POST `/shinsei/requests/12/approve`（山田、403）の Network タブ |
| `screen-network-500.jpg` | 教材用に 500 を返した POST `/shinsei/requests/12/approve` の Network タブ |
| `screen-network-pending.jpg` | HTML のリクエストを終わらせない Network タブ |

## 図のアイコン（インライン SVG）

`src/components/Icon.tsx` のストロークアイコンは、[SVG Repo](https://www.svgrepo.com/collections/monocolor/) の monocolor 系（CC0）を参考にしています。ファイルとしては置かず、教材用に簡略化したパスをコンポーネント内に持ちます。
