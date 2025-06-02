from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # CORSMiddlewareをインポート
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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
    allow_origins=["*"],  # ここを "*" だけに
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files from the frontend build directory
app.mount("/static", StaticFiles(directory="../../frontend/build"), name="static")

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

# Serve the frontend's index.html for the root path
@app.get("/")
async def read_index():
    return FileResponse("../../frontend/build/index.html")

# Catch-all route to serve index.html for client-side routing
@app.get("/{full_path:path}")
async def read_full_path(full_path: str): # Added type hint for full_path
    return FileResponse("../../frontend/build/index.html")

# 動作確認用 (変更なし)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)