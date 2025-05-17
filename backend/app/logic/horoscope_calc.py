# HexaCodexProject/backend/app/logic/horoscope_calc.py
from .penta_calculator import calculate_penta_details # 新しい計算モジュールをインポート

def calculate_horoscope(year: int, month: int, day: int) -> dict:
    """
    指定された生年月日から、penta_calculatorのロジックに基づいて占術結果を計算する。
    """
    try:
        # penta_calculator がエラーを含む結果を返す可能性も考慮
        result = calculate_penta_details(year, month, day)
        if result.get("error"):
            return {"error": result["error"]}
        return result
    except Exception as e:
        # 予期せぬエラーもキャッチ
        return {"error": f"An unexpected error occurred in calculate_penta_details: {str(e)}"}

if __name__ == "__main__":
    # 新しいロジックでのテストケース
    test_cases = [
        (1994, 9, 20), # MARI α
        (1994, 12, 28),# AKARI α
        (2021, 12, 6), # AKARI β
        (1980, 11, 20),# NOAH α
        (1987, 2, 28), # MARI ×KINRYU β
        (1990, 9, 25), # 火星人プラス霊合 (AKARI_α × SENRI_α のようなもの)
        (1972, 11, 13) # 木村拓哉 木星人プラス (MARI_α)
    ]
    for year, month, day in test_cases:
        print(f"\n--- TESTING FOR {year}/{month}/{day} (Using penta_calculator) ---")
        result = calculate_horoscope(year, month, day)
        print(f"生年月日: {year}/{month}/{day} → 診断結果: {result}")
        print("--------------------------------------")