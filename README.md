# vastra-otani — 大谷さん「脳内移植」コンテンツ生成プロジェクト

大谷さんの知識・発言・考え方を Markdown ノートとして蓄積し、Claude Code の Skill を使って
X（旧Twitter）投稿や note 記事を自動生成する仕組みです。

元ネタ: 「Claude Codeの講座で『脳を移植しているから』という話があり、これを大谷さんの
頭の中の移植（＝知識・語り口の構造化）に応用できないか」という発想（Slackスレッドより）。

## 構成

```
knowledge/            大谷さんの発言・知識ノート（Obsidian的にMarkdownで蓄積）
  events/              講座・打ち合わせなど個別の発言録
  templates/           ノート作成用テンプレート
.claude/skills/
  otani-voice/         大谷さんの語り口でX投稿・note記事を生成するSkill
output/                生成されたX投稿・note記事の下書き置き場
```

## 使い方

1. `knowledge/events/` に大谷さんの発言・知識をMarkdownノートとして追加する
   （`knowledge/templates/event.md` をコピーして使う）。
2. Claude Code で `/otani-voice` を実行し、素材にしたいノートやテーマを指定する。
3. `output/` に生成された下書き（X投稿案・note記事案）が保存されるので、
   人間がレビュー・編集してから実際に投稿する。

## コスト方針

このプロジェクト内の生成はすべて Claude Code の対話内で完結し、追加API課金は発生しません。
外部サービス連携（画像生成・自動投稿API等）で費用が発生する変更を行う場合は、
実施前に必ず確認を取ります。
