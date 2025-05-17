# HexaCodexProject/backend/app/logic/penta_calculator.py
import math
from datetime import date, datetime, timezone
from typing import Dict, Any, Tuple, Optional

# --- penta-only.tsからの移植 ---

def diff_in_days(date_value1_ts: float, date_value2_ts: float) -> int:
    """
    TypeScriptのDate.valueOf() (ミリ秒単位のタイムスタンプ) を受け取り、日数の差を計算する。
    """
    return math.floor((date_value1_ts - date_value2_ts) / 86400000)

def get_branch_of_year(year: int) -> int:
    """
    年の干支のインデックスを返す (0:子 .. 11:亥)。
    penta-only.ts のロジックに基づく。立春はここでは考慮されない。
    """
    return ((year - 1984) % 12 + 12) % 12

def get_destiny_number_ts_logic(year: int, month: int, day: int) -> int:
    """
    指定された日付の運命数を計算する (1-60)。
    penta-only.ts の getDestinyNumber ロジックに基づく。
    """
    # CalendarDate().valueOf() に相当する処理
    # Date.UTC(this.year, this.month - 1, this.day)
    current_date_ts = datetime(year, month, day, tzinfo=timezone.utc).timestamp() * 1000

    # Date.UTC(1978, 6, 1) -> 1978年7月1日 (monthは0-indexed)
    base_date_ts = datetime(1978, 7, 1, tzinfo=timezone.utc).timestamp() * 1000
    
    days_diff = diff_in_days(current_date_ts, base_date_ts)
    
    destiny_num = (days_diff % 60 + 60) % 60 + 1
    return destiny_num

# --- Hexa Codex 向けのデータ構造と名称定義 ---
PENTA_ELEMENT_NAMES = {
    0: "KAIRI",  # 海里 (土星人)
    1: "KINRYU", # 金龍 (金星人)
    2: "AKARI",  # 灯里 (火星人)
    3: "NOAH",   # 望愛 (天王星人)
    4: "MARI",   # 麻里 (木星人)
    5: "SENRI"   # 泉里 (水星人)
}

PENTA_YIN_YANG_NAMES = {
    0: "_α", # A (α)
    1: "_β"  # B (β)
}

# penta-only.ts の g === el を利用したジュメリ判定で、
# どの基本星人がどの相手星とジュメリになるかの対応表 (六星占術の一般的な組み合わせに基づく)
# このマッピングは、penta-only.tsの `g` の計算ロジックと実際の六星占術のジュメリの相手星の
# 関係性を正確に把握した上で定義する必要がある。
# penta-only.tsの `g` が示すものが、直接的に相手星を示しているわけではないため、
# ここは従来のjumeri_mappingを参考にしつつ、新しいロジックとの整合性を取る必要がある。
# 今回は、まずpenta-only.tsの`gemelli: boolean`を使い、
# ジュメリである場合に具体的な名称をどうするかは次の課題とする。

# 六星占術の一般的なジュメリ組み合わせ (「Hexacodex概要.docx」より)
# この情報は、penta-only.ts の g === el が true の場合に、どの組み合わせになるかを決定するために使用する。
# キーは基本星人の名前 (KAIRIなど)。値は相手の星人の名前。
GENERAL_JUMERI_PARTNERS = {
    "KAIRI": "NOAH",   # 土星人霊合の相手は天王星人
    "KINRYU": "MARI",  # 金星人霊合の相手は木星人
    "AKARI": "SENRI",  # 火星人霊合の相手は水星人
    "NOAH": "KAIRI",   # 天王星人霊合の相手は土星人
    "MARI": "KINRYU",  # 木星人霊合の相手は金星人
    "SENRI": "AKARI"   # 水星人霊合の相手は火星人
}


def calculate_penta_details(year: int, month: int, day: int) -> Dict[str, Any]:
    """
    penta-only.ts のロジックに基づいて、星人情報、α/β、ジュメリ有無を計算する。
    立春は現在のバージョンでは考慮していない（penta-only.ts の year の直接使用に準拠）。
    """
    # print(f"DEBUG: Calculating for {year}-{month}-{day}")

    # 運命数を計算 (penta-only.ts ロジック)
    destiny_number = get_destiny_number_ts_logic(year, month, day)
    # print(f"DEBUG: Destiny Number = {destiny_number}")

    # 基本星の要素 (0-5)
    el_index = math.floor((destiny_number - 1) / 10)
    base_star_name = PENTA_ELEMENT_NAMES.get(el_index)
    if base_star_name is None:
        return {"error": f"Could not determine base star name for element index {el_index}"}
    # print(f"DEBUG: Element Index = {el_index}, Base Star Name = {base_star_name}")
    
    # α/β (陰陽) を決定 (年の西暦の偶奇に基づく)
    # penta-only.ts: yinyang: date.year % 2 (0がα, 1がβと仮定)
    # Python: year % 2 == 0 なら α (index 0), year % 2 == 1 なら β (index 1)
    yinyang_index = year % 2
    alpha_beta_suffix = PENTA_YIN_YANG_NAMES.get(yinyang_index)
    if alpha_beta_suffix is None: # 通常ありえない
        return {"error": f"Could not determine alpha/beta for yinyang index {yinyang_index}"}
    
    star_type_with_ab = f"{base_star_name}{alpha_beta_suffix}"
    # print(f"DEBUG: YinYang Index = {yinyang_index}, AlphaBeta Suffix = {alpha_beta_suffix}, StarType w/ AB = {star_type_with_ab}")

    # 干支のインデックスを計算 (立春非考慮の年で)
    # 注意: penta-only.ts の getBranchOfYear は立春を考慮していない。
    # 六星占術の本来の干支は立春基準なので、この干支の使い道に注意。
    # penta-only.ts のジュメリ判定 g の計算で year をそのまま使っているので、それに倣う。
    branch_index = get_branch_of_year(year) # グレゴリオ暦の年をそのまま使用
    zodiac_names = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    zodiac_sign = zodiac_names[branch_index]
    # print(f"DEBUG: Branch Index (Eto) = {branch_index}, Zodiac Sign = {zodiac_sign}")


    # ジュメリ判定 (penta-only.ts ロジック)
    # g = Math.floor((11 - getBranchOfYear(date.year)) / 2);
    # gemelli: g === el;
    g = math.floor((11 - branch_index) / 2) # branch_index は年の干支のインデックス
    is_gemelli = (g == el_index)
    # print(f"DEBUG: g = {g}, el_index = {el_index}, Is Gemelli = {is_gemelli}")

    jumeri_name = None
    if is_gemelli:
        # penta-only.ts では相手星を特定していないため、Hexa Codexの命名規則に合わせる必要がある。
        # GENERAL_JUMERI_PARTNERS を使って相手星を推定し、名称を組み立てる。
        partner_star_name = GENERAL_JUMERI_PARTNERS.get(base_star_name)
        if partner_star_name:
            # ジュメリのα/βは、元の星のα/βを引き継ぐという一般的な解釈を採用
            jumeri_name = f"{base_star_name}×{partner_star_name}{alpha_beta_suffix}"
        else:
            # 万が一パートナーが見つからない場合は、汎用的な名前にフォールバック（またはエラー）
            jumeri_name = f"{star_type_with_ab}_ジュメリ" # 仮の名称
            # print(f"WARNING: Could not determine Jumeri partner for {base_star_name}")


    return {
        "zodiac": zodiac_sign, # 注意: この干支は立春を考慮していません
        "star_type": star_type_with_ab,
        "jumeri": jumeri_name,
        # "debug_info": { # デバッグ用に途中結果を返すことも可能
        #     "destiny_number": destiny_number,
        #     "element_index": el_index,
        #     "yinyang_index": yinyang_index,
        #     "branch_index_for_gemelli_g": branch_index,
        #     "g_value_for_gemelli": g,
        #     "is_gemelli_ts_logic": is_gemelli
        # }
    }

if __name__ == '__main__':
    # テスト用
    # 例: 1990年9月25日
    # ユーザー提供の正解データと突き合わせるには、このpenta-only.tsのロジックが
    # 公式サイトのロジック（特に立春の扱い）とどう異なるかを理解する必要がある。
    # 今回は penta-only.ts に忠実に移植。
    
    # 1994/09/20	MARI α (正解)
    # penta-only.tsのロジックだと...
    # DN = get_destiny_number_ts_logic(1994,9,20) -> (1994/9/20からの日数) % 60 + 1
    # el = floor((DN-1)/10)
    # yinyang = 1994 % 2 = 0 (α)
    # g = floor((11 - getBranchOfYear(1994))/2)
    # gemelli = g == el
    print(f"1994/9/20: {calculate_penta_details(1994, 9, 20)}")
    
    # 1987/02/28	MARI ×KINRYU　β (正解)
    print(f"1987/2/28: {calculate_penta_details(1987, 2, 28)}")
    
    # 以前エラーが出たケース
    print(f"1990/2/3: {calculate_penta_details(1990, 2, 3)}")
    print(f"2025/2/2: {calculate_penta_details(2025, 2, 2)}")
    print(f"1912/1/15: {calculate_penta_details(1912, 1, 15)}")