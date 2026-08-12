# vastra-otani

大谷さんの知識・語り口を Markdown ノート（`knowledge/`）として蓄積し、Claude Code の
Skill（`otani-voice`）で X投稿・note記事の下書きを自動生成するプロジェクト。

- ノートの追加場所: `knowledge/events/`（テンプレートは `knowledge/templates/event.md`）
- 料金表・サービス設計など、単発イベントではない参照資料: `knowledge/reference/`
- コンテンツ生成: `otani-voice` Skill を使用。生成物は `output/` に保存する。
- コスト方針: すべてClaude Code内で完結。外部API・有料サービスを使う変更は事前確認必須。
