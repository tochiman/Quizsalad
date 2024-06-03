# Quizsalad

## 起動方法
1. このリポジトリを持ってくる
```bash
git clone https://github.com/tochiman/Quizsalad.git
```
2. frontコンテナのセットアップ(初回起動のみ実行)
```bash
docker compose run --rm front sh -c "yarn install"
```
3. コンテナの起動
```bash
docker compose up -d
```