# landrepo
フロントエンドとバックエンドのコードをまとめたモノレポ


## 構成
- `apps/web/`
  - フロントエンドのコード
  - *Next.js* 利用
- `apps/api/`
  - APIエンドポイントのコード
  - *Nest.js* 利用


## ワークスペース
以下は、ワークスペースとして指定している。

※`package.json` の *workspaces* フィールド参照

- `apps/`
  - アプリケーションのプロジェクトをディレクトリ単位で格納している。
- `packages/`
  - リポジトリ内で共有するコードやファイルをディレクトリ単位で格納している。


## 開発環境
- `Node.js` *v16.14.0* 以上
- `npm` *v8.3.0* 以上

もし、同梱しているDockerコンテナを使う場合はDockerエンジンと `docker-compose` コマンドがインストール済みであること。


## 準備
### インストール
リポジトリのルートにて、コマンドを実行する。

```bash
npm install
```

### dotenvファイルの作成
この手順は **ローカルで開発する際に必要です。**

**作成後、適宜編集すること。**

```bash
# apps/api
cp apps/api/.env.example apps/api/.env.local
## または次のファイル名で作成
cp apps/api/.env.example apps/api/.env.development.local


# apps/web
cp apps/api/.env.example apps/api/.env.local
## または次のファイル名で作成 (ただし、ビルドする際は .env.production.local ファイルも用意すること)
cp apps/api/.env.example apps/api/.env.development.local


# packages/database
cp packages/database/.env.example packages/database/.env
```

### Dockerコンテナ
詳細は `docker-compose.yml` にコンテナ定義がある。

主に次のコンテナを扱う。

- `postgres` データベース

```bash
# イメージ作成
docker-compose build

# コンテナ作成・起動
docker-compose up -d
```
