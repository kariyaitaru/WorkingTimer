# WorkingTimer
[作業時間管理アプリ](https://kariyaitaru.github.io/WorkingTimer/)

## アプリの機能概要
業務やプライベートなどで、どの作業にどの程度の時間を要したか、その実績を日毎に記録するアプリです。

## 利用イメージ
![demo](https://raw.githubusercontent.com/wiki/kariyaitaru/WorkingTimer/images/sagyojikanwokiroku.gif)

## 使い方
- プロジェクト、作業のそれぞれにわかりやすい名前を入力する。<br>
例⇒ プロジェクト：業務システム構築プロジェクト　作業：要件定義
- [追加する]ボタンを押して、作業カードを作成する。
- 作業を開始する際に、該当の作業カードをクリックする。
- 割り込みで作業が発生した場合、作業を終了した場合など、それぞれの作業カードをクリックして、進行中の作業を切り替える。
- 結果は毎分自動更新されるため、特に操作は不要。
- 結果は画面に表示されるだけなので、画面からコピペでExcelファイルや他システムに転記する。
- 作業記録のみを削除する場合は[結果をクリアする]ボタンを押す。
- 作業カードと作業記録の全てを削除する場合は[全て削除する]ボタンを押す。

※データはローカルストレージに保存するため、ブラウザが起動していない状態でもタイマーはカウントアップし続けます。
作業時間として記録したくない場合は、全ての作業カードをOFFにしてからブラウザを終了してください。

## 補足
このアプリはフロントエンドのみで実装しております。
入力内容を取得したり監視したり…ということはないので、気兼ねなくご自由にお使いください。
