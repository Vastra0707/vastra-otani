/**
 * Vastra お問い合わせフォームを自動生成する Google Apps Script。
 *
 * 使い方:
 *   1. https://script.google.com/ を開く（大谷さん・Vastraの運用に使うGoogleアカウントでログイン）
 *   2. 「新しいプロジェクト」を作成し、エディタの中身をこのファイルの内容にすべて置き換えて保存
 *   3. 上部の実行対象の関数で createVastraForm を選び、「実行」をクリック
 *   4. 初回は権限の承認を求められるので、自分のアカウントで許可する
 *      （フォーム/スプレッドシート作成のみの権限。外部送信は行わない）
 *   5. 実行完了後、「実行数」または「ログを表示」から
 *      編集用URL・回答フォームURL・回答スプレッドシートURLを確認する
 *
 * ベース: output/2026-08-10_vastra-otoiawase-form.md
 */
function createVastraForm() {
  var form = FormApp.create('Vastra お問い合わせフォーム');

  form.setDescription(
    'デザインコンサルティングを中心に、CDO支援・デザインマネジメント・ブランディング・\n' +
    'クリエイティブ要件定義や制作ディレクションまで、経営とデザインをつなぐご支援を行っています。\n\n' +
    '下記フォームよりご相談内容をお送りください。内容を確認の上、担当より折り返しご連絡いたします。\n' +
    '※恐れ入りますが、単発のバナー・LP制作等の小規模制作のみのご依頼は\n' +
    '　対応が難しい場合がございます。あらかじめご了承ください。'
  );

  form.setConfirmationMessage(
    'お問い合わせいただきありがとうございます。\n' +
    '内容を確認の上、担当より2〜3営業日以内にご連絡いたします。'
  );

  form.setLimitOneResponsePerUser(false);

  // 質問1: お名前
  form.addTextItem()
    .setTitle('お名前')
    .setRequired(true);

  // 質問2: 会社名・屋号
  form.addTextItem()
    .setTitle('会社名・屋号')
    .setHelpText('個人でのお問い合わせの場合は空欄で構いません');

  // 質問3: メールアドレス
  var emailValidation = FormApp.createTextValidation()
    .setHelpText('メールアドレスの形式で入力してください。')
    .requireTextIsEmail()
    .build();
  form.addTextItem()
    .setTitle('メールアドレス')
    .setRequired(true)
    .setValidation(emailValidation);

  // 質問4: 電話番号
  form.addTextItem()
    .setTitle('電話番号');

  // 質問5: ご相談内容
  form.addCheckboxItem()
    .setTitle('ご相談内容')
    .setRequired(true)
    .setChoiceValues([
      'CDO(最高デザイン責任者)支援',
      'デザインマネジメント(チーム組成・採用支援)',
      'ブランディング策定',
      'クリエイティブ要件定義・仕組み化',
      'クリエイティブ制作ディレクション',
      'デザイン定義・クオリティコントロール',
      'その他制作のご相談(バナー・LP等)',
      '業務提携・協業のご相談',
      'まだ相談内容が明確でない・壁打ちしたい'
    ]);

  // 質問6: ご相談内容の詳細
  form.addParagraphTextItem()
    .setTitle('ご相談内容の詳細')
    .setHelpText('現状の課題や、実現したいことをできるだけ具体的にご記入ください。')
    .setRequired(true);

  // 質問7: ご予算感
  form.addMultipleChoiceItem()
    .setTitle('ご予算感(目安)')
    .setChoiceValues([
      '〜月額5万円程度',
      '月額15万円程度',
      '月額30万円程度',
      '月額50万円以上',
      'スポット(単発)でのご相談',
      '未定・ご相談したい'
    ]);

  // 質問8: ご契約を想定している期間
  form.addMultipleChoiceItem()
    .setTitle('ご契約を想定している期間')
    .setChoiceValues([
      '3〜4ヶ月程度',
      '半年〜1年程度',
      '単発・短期のみ',
      '未定'
    ]);

  // 質問9: ご希望の開始時期
  form.addMultipleChoiceItem()
    .setTitle('ご希望の開始時期')
    .setChoiceValues([
      'すぐにでも',
      '1ヶ月以内',
      '3ヶ月以内',
      '未定'
    ]);

  // 質問10: 資料・秘密保持について
  form.addMultipleChoiceItem()
    .setTitle('資料・秘密保持について')
    .setHelpText('過去のご支援実績はクローズドな形でのご紹介となります。')
    .setChoiceValues([
      '秘密保持契約(NDA)を締結の上で資料共有を希望する',
      '現時点では不要',
      '詳細を相談したい'
    ]);

  // 質問11: どちらでお知りになったか（「紹介」選択時のみ質問11aへ分岐）
  var q11 = form.addMultipleChoiceItem()
    .setTitle('どちらでVastraをお知りになりましたか');

  var pageReferral = form.addPageBreakItem().setTitle('紹介者情報');
  form.addTextItem().setTitle('紹介者のお名前');

  var pageFinal = form.addPageBreakItem().setTitle('その他ご質問');
  form.addParagraphTextItem().setTitle('その他ご質問・ご要望');

  q11.setChoices([
    q11.createChoice('紹介(リファラル)', pageReferral),
    q11.createChoice('SNS(X / note等)', pageFinal),
    q11.createChoice('Webサイト・検索', pageFinal),
    q11.createChoice('その他', pageFinal)
  ]);

  // 回答を集計する専用スプレッドシートを作成してリンク
  var ss = SpreadsheetApp.create('Vastra お問い合わせフォーム 回答');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  var result = {
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl(),
    spreadsheetUrl: ss.getUrl()
  };

  Logger.log('編集用URL: ' + result.editUrl);
  Logger.log('回答フォームURL: ' + result.publishedUrl);
  Logger.log('回答スプレッドシート: ' + result.spreadsheetUrl);

  return result;
}
