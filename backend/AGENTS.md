# AGENTS.md

## プロジェクト名
Hexa Codex

## 概要
六星占術ベースのロジックを用いた性格診断アプリ。ユーザーの生年月日から診断ロジックを走らせ、zodiac（干支）、star_type（星人タイプ）、jumeri（ジュメリ）を返す。

## 禁止事項
backend/app/logic/penta_calculator.py のコードは **絶対に編集してはいけません**。このファイルは「正」として扱います。

## ディレクトリ構成（主要）
- backend/app/main.py: FastAPIのエントリーポイント
- backend/app/logic/: 診断ロジック（horoscope_calc.pyはAPIから呼び出す中間層）
- frontend/: React + TypeScriptベース（Material UI導入予定）
- documents/: 仕様書とロジック原本（penta-only.ts）

## 使用技術
- Backend: Python, FastAPI, SQLite
- Frontend: React, TypeScript (予定), Material UI (予定)
- デプロイ未定（ローカル環境想定）

## 起動方法（仮想環境内で）
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
