📄 README.md（Hexa Codex プロジェクト）
markdown
コードをコピーする
# Hexa Codex（ヘキサ・コーデックス）

Hexa Codex は、六星占術の原理をベースとした性格診断Webアプリです。  
ユーザーの生年月日を入力すると、独自ロジックに基づいて以下の3要素を導出し、自己理解の一助となる情報を提供します。

- **zodiac**（干支）
- **star_type**（星人タイプ + 陰陽属性）
- **jumeri**（特殊相性タイプ、存在する場合のみ）

---

## 🔮 アプリのコンセプト

- **基本6コードタイプ（星人）**: KAIRI, KINRYU, AKARI, NOAH, MARI, SENRI
- **陰陽属性**: 各コードに _α または _β を付加
- **ジュメリ**: 特定の条件（g === el）で判定される、2種の組合せ型タイプ（例: KAIRI×NOAH_α）

---

## 📈 今後の展望

- 各24タイプ（基本12＋ジュメリ12）に対し**性格質問**を実装予定
- サブタイプへの分岐により、最終的に48〜58分類の性格診断を目指す
- 詳細は `documents/Hexacodex概要.docx` を参照

---

## 🚀 新しい診断フロー概要

1. **生年月日入力ページ**で基本分類を取得
2. 結果表示後、"さらに本質を探るための質問に進む" ボタンから
3. 選ばれた分類専用の21問を1問ずつ回答
4. 回答数でサブタイプ(-1/-2)を判定し、合計48分類を提示

`frontend/src/constants/questions.json` と
`frontend/src/constants/features/catch_base.json`、`catch_giumeri.json`
にそれぞれ質問と公式のキャッチコピー・解説データを管理しています。

### サブタイプ表示のフィルタ

21問の回答後に表示する最終結果では、選択されたサブタイプ以外の説明が混在しないよう、`getDetailedFeature()` でサブタイプを絞り込んだデータのみを取得しています。以下のように返された `catch` や `subTitle` などをそのまま表示することで、確定したサブタイプだけの情報をユーザーに提示できます。

```tsx
const info = getDetailedFeature(finalKey);
if (info) {
  setResult({ category: finalKey, ...info, subType });
}
```

表示例:

```jsx
<div data-testid="final-result">
  <h3>{result.category}</h3>
  <p>{result.catch}</p>
  <h4>{result.subTitle}</h4>
  <p>{result.subDescription}</p>
</div>
```

### UI改善と重複表示バグの修正

- 質問ページでは質問文を中央に大きく表示し、その下に「はい/いいえ」のラジオボタンを横並びに配置するようレイアウトを調整しました。
- 最終結果ページでは `getDetailedFeature()` から得たサブタイプ情報のみを描画し、他のサブタイプの説明が混在しないようロジックを整理しました。
- テストでは結果表示内の `subTitle` が1つだけ存在するか確認し、重複表示がないことを検証しています。

### 診断最終結果ページのレイアウト

最終結果画面では以下の順序で要素を中央寄せに配置します。

```jsx
<div className="final-result">
  <div className="result-text">
    <h3 className="type-name">{result.category}</h3>
    <p className="catch-copy">{result.catch}</p>
  </div>
  <video className="result-video" src="/movie/TYPE.mp4" autoPlay loop muted playsInline />
  <div className="result-text">
    <ul className="acronym-list">{/* ... */}</ul>
    <p>{result.baseDescription}</p>
  </div>
</div>
```

CSS例:

```css
.final-result {
  text-align: center;
}
.final-result video {
  margin: 2rem auto;
}
.final-result .type-name {
  font-size: 2.4rem;
}
.final-result .catch-copy {
  margin-bottom: 2rem;
}
```

動画を独立したブロックとして中央に配置し、上部に分類名とキャッチコピー、
下部にアクロニムや説明文を置くことで読みやすさを高めています。


## ⚙️ 技術スタック

| 項目        | 技術                              |
|-------------|-----------------------------------|
| バックエンド | Python / FastAPI / SQLite        |
| 占術ロジック | TypeScript（元コード）→ Python移植 |
| フロントエンド（予定） | React / TypeScript / Material UI  |

---

## 🧠 ロジックに関する経緯と構成

- 初期は六星占術の一般的ロジックで構築
- 公式の挙動と一致しないため、**ご友人提供の TypeScriptコード `penta-only.ts`** を正とし、Pythonで忠実に移植
- 完成したPythonロジックは `backend/app/logic/penta_calculator.py` に実装済み（※絶対に改変禁止）
- 判定要素：
  - 干支計算: 西暦から直接（立春基準は不採用）
  - 陰陽: 西暦の偶奇で判定（year % 2）
  - ジュメリ: g === el 判定＋定義済マッピング（`GENERAL_JUMERI_PARTNERS`）

---

## 📁 ディレクトリ構成（主要）

HexaCodexProject/
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPIアプリケーション、CORS設定済み
│ │ └── logic/
│ │ ├── penta_calculator.py # ロジック本体（編集禁止）
│ │ └── horoscope_calc.py # ロジック呼び出し＆整形用中間層
│ ├── venv/ # 仮想環境（.gitignore済み）
│ └── requirements.txt
├── frontend/ # React + TypeScript（開発予定）
│ └── README.md（CRAデフォルト）
├── documents/
│ ├── Hexacodex概要.docx # 全体仕様と今後の計画
│ └── penta-only.ts # 占術ロジック原本（TypeScript）
└── AGENTS.md # Codex向け仕様補足ファイル

yaml
コードをコピーする

---

## 🔌 API仕様（現在実装済み）

### ✅ `/diagnose`（POST）

#### 入力
```json
{
  "year": 1994,
  "month": 12,
  "day": 6
}
出力
json
コードをコピーする
{
  "zodiac": "戌",
  "star_type": "AKARI_α",
  "jumeri": "SENRI×AKARI_α"
}
CORS設定済み → 外部フロントエンドから直接呼び出し可能

🚧 開発ステータスと今後の課題
✅ 実装済み
penta_calculator.py: TypeScript移植済み、検証済み

/diagnose API：動作確認済み

CORS設定済みでフロント接続準備完了

🔜 今後の開発予定
React + TypeScript + Material UI によるフロント開発開始

診断結果画面とフォームの整備

サブタイプ分類機能（性格質問 → 絞り込み）

ジュメリ名称の最終ルール確認

SQLiteまたは他DB導入（結果保存等）

テスト整備、ロギングの充実

🚫 エンジニアへの重要な引き継ぎ事項
❗占術ロジックのブラックボックス化
backend/app/logic/penta_calculator.py のコードは絶対に変更禁止

このファイルは penta-only.ts を移植した唯一正確な再現であり、ユーザー検証済

以後のロジック（性格分類、UI出力、診断評価など）は、このブラックボックスが返す結果のみを元に実装する

▶️ 開発・起動手順
バックエンド（FastAPI）
bash
コードをコピーする
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
フロントエンド（予定）
bash
コードをコピーする
cd frontend
npm install
npm start
🧾 関連ファイル
AGENTS.md：Codexエージェント用の仕様補足書

Hexacodex概要.docx：設計思想、今後の機能追加方針などを記載

penta-only.ts：TypeScriptで記述された元ロジック（バックアップ兼ドキュメント）

## Matrix Rain Background

The React frontend now includes a Matrix-style falling code effect behind all UI
elements. The implementation lives in `frontend/src/components/MatrixBackground.tsx`.
Import this component in `src/App.tsx` and place `<MatrixBackground />` at the
top level of the render tree. The canvas uses `position: fixed` with
`z-index: -1` and `pointer-events: none` so the regular UI remains fully
interactive.

No extra dependencies are required; the effect is drawn using the HTML Canvas API.

## Diagnosis Result Videos

The final result page shows a looping video clip that corresponds to each
subtype. A small utility maps the result key (e.g. `MARI_α-1`) to the exact file
name found under `frontend/public/movie/`. Only six types are currently
supported:

| Result key | Video file |
|-----------|----------------|
| `MARI_α-1` | `Mari_alpha_1.mp4` |
| `MARI_α-2` | `Mari_alpha_2.mp4` |
| `MARI_β-1` | `Mari_beta_1.mp4` |
| `MARI_β-2` | `Mari_beta_2.mp4` |
| `AKARI_α-1` | `Akari_alpha_1.mp4` |
| `AKARI_α-2` | `Akari_alpha_2.mp4` |

If a mapping is missing or the file fails to load, a placeholder image
`default_poster.jpg` is shown instead.

