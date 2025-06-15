# Gitブランチ管理練習用プロジェクト

このプロジェクトは、Gitのブランチ管理を練習するためのシンプルなTODOアプリケーションです。

## プロジェクト構成

```
git-management-training/
├── index.html      # メインのHTMLファイル
├── styles.css      # スタイルシート
├── script.js       # JavaScript機能
└── README.md       # このファイル
```

## 機能

- タスクの追加・削除・完了/未完了の切り替え
- ローカルストレージでのデータ保存
- 統計情報の表示（完了済み/総数）
- レスポンシブデザイン

## Git練習の手順

### 1. 初期設定
```bash
git init
git add .
git commit -m "初期コミット: TODOアプリの基本機能を実装"
```

### 2. ブランチ作成練習
```bash
# 新機能ブランチを作成
git checkout -b feature/add-priority
git checkout -b feature/add-categories
git checkout -b bugfix/fix-storage-issue

# ブランチ一覧を確認
git branch
```

### 3. ブランチでの作業
```bash
# 各ブランチでファイルを編集
git add .
git commit -m "機能追加: 優先度機能を実装"
```

### 4. マージ練習
```bash
# mainブランチに戻る
git checkout main

# ブランチをマージ
git merge feature/add-priority
```

### 5. コンフリクト練習
```bash
# 意図的にコンフリクトを発生させる
# 同じファイルの同じ行を異なるブランチで編集
```

## 練習シナリオ

### シナリオ1: 新機能開発
1. `feature/add-priority`ブランチを作成
2. タスクに優先度（高・中・低）を追加
3. 優先度でソート機能を実装
4. mainブランチにマージ

### シナリオ2: バグ修正
1. `bugfix/fix-storage-issue`ブランチを作成
2. ローカルストレージの不具合を修正
3. テストを追加
4. mainブランチにマージ

### シナリオ3: コンフリクト解決
1. 複数のブランチで同じファイルを編集
2. マージ時にコンフリクトを発生
3. コンフリクトを手動で解決
4. マージを完了

## ブランチ命名規則

- `feature/機能名` - 新機能開発
- `bugfix/修正内容` - バグ修正
- `hotfix/緊急修正` - 緊急修正
- `refactor/リファクタリング` - コード改善

## 便利なコマンド

```bash
# ブランチ一覧表示
git branch -a

# ブランチの詳細表示
git log --oneline --graph --all

# ブランチの削除
git branch -d ブランチ名

# 強制削除
git branch -D ブランチ名

# リモートブランチの取得
git fetch origin

# リモートブランチの削除
git push origin --delete ブランチ名
```

## 注意事項

- このプロジェクトは練習用です
- 実際のプロダクションでは使用しないでください
- ローカルストレージを使用しているため、ブラウザのデータをクリアするとタスクが消えます

## ライセンス

このプロジェクトは学習目的で作成されており、自由に使用・改変できます。 