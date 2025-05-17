from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # CORSMiddlewareをインポート

# 以前の .logic.horoscope_calc からのインポートは、
# penta-only.ts ベースの新しい計算ロジックを呼び出すように修正されている前提です。
# 例えば、 from .logic.horoscope_calc import calculate_horoscope のままか、
# あるいは from .logic.penta_calculator import calculate_penta_details を直接使う形に
# horoscope_calc.py が修正されているとします。
# ここでは、horoscope_calc.py が新しい計算ロジックを呼び出すように修正済みと仮定します。
from .logic.horoscope_calc import calculate_horoscope

app = FastAPI()

# CORS設定
origins = [
    "http://localhost", # React開発サーバーのデフォルトポートなし (許可しない方が良い場合もある)
    "http://localhost:3000", # React開発サーバーの一般的なポート
    # 将来的にデプロイするフロントエンドのオリジンも追加する必要があればここに追加
    # 例: "https://your-frontend-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # 許可するオリジンのリスト
    allow_credentials=True, # クレデンシャル（Cookieなど）を許可するかどうか
    allow_methods=["*"], # 全てのHTTPメソッドを許可（GET, POST, PUT, DELETEなど）
    allow_headers=["*"], # 全てのHTTPヘッダーを許可
)

class Birthdate(BaseModel):
    year: int
    month: int
    day: int

@app.post("/diagnose")
def diagnose(birthdate: Birthdate):
    # calculate_horoscope は penta_calculator.py のロジックを使うように
    # 内部的に修正されている前提
    result = calculate_horoscope(birthdate.year, birthdate.month, birthdate.day)
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result

# 動作確認用 (変更なし)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)