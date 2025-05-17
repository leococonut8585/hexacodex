import os
import json
import anthropic
import sys
import base64
from PIL import Image
import io
from dotenv import load_dotenv

# .envファイルから環境変数をロード
load_dotenv()

# APIキーを直接設定
api_key = "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"

# Anthropicクライアントを初期化
client = anthropic.Anthropic(api_key=api_key)

def encode_file(file_path):
    """ファイルをbase64エンコードする"""
    with open(file_path, "rb") as file:
        return base64.b64encode(file.read()).decode('utf-8')

def get_media_type(file_path):
    """ファイルの拡張子からメディアタイプを判断"""
    ext = os.path.splitext(file_path)[1].lower()
    if ext in ['.jpg', '.jpeg']:
        return "image/jpeg"
    elif ext == '.png':
        return "image/png"
    elif ext == '.pdf':
        return "application/pdf"
    else:
        return "application/octet-stream"

def send_to_claude(prompt, file_paths=None):
    """指定されたプロンプトとファイル（画像やPDF）をClaude 3.7 Sonnetに送信し、レスポンスを取得する"""
    try:
        messages = [{"role": "user", "content": []}]
        
        # テキストプロンプトを追加
        messages[0]["content"].append({"type": "text", "text": prompt})
        
        # ファイルがある場合は追加
        if file_paths:
            for file_path in file_paths:
                # ファイルをbase64エンコード
                base64_data = encode_file(file_path)
                media_type = get_media_type(file_path)
                
                # メッセージにファイルを追加
                content_item = {
                    "type": "image" if "image" in media_type else "file",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": base64_data
                    }
                }
                
                messages[0]["content"].append(content_item)
        
        # Claudeにリクエストを送信
        response = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=4000,
            temperature=0.7,
            system="あなたはHexa Codex性格診断アプリの開発を支援するAIアシスタントです。運命数テーブルと干支判定に基づいて、生年月日から初期コードタイプを判定するAPIを開発しています。提供された情報から完全なmain.pyファイルを作成してください。",
            messages=messages
        )
        
        # 結果を返す
        return response.content[0].text
    except Exception as e:
        return f"エラー: {str(e)}"

def save_response_to_file(response, file_path):
    """Claudeからの応答をファイルに保存する"""
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(response)
        return f"応答を {file_path} に保存しました。"
    except Exception as e:
        return f"ファイルの保存中にエラーが発生しました: {str(e)}"

def extract_python_code(response):
    """Claudeの応答からPythonコードブロックを抽出する"""
    import re
    
    # Pythonコードブロックを抽出（Markdownフォーマット）
    pattern = r"```python\n(.*?)```"
    matches = re.findall(pattern, response, re.DOTALL)
    
    if matches:
        return matches[0]
    else:
        # コードブロックが見つからない場合は、応答全体を返す
        return response

def main():
    # コマンドライン引数を確認
    if len(sys.argv) < 3:
        print("使用方法: python claude_api.py プロンプトファイル 出力ファイル [ファイル1] [ファイル2] ...")
        return
    
    prompt_file = sys.argv[1]
    output_file = sys.argv[2]
    file_paths = sys.argv[3:] if len(sys.argv) > 3 else None
    
    # プロンプトファイルを読み込む
    try:
        with open(prompt_file, "r", encoding="utf-8") as file:
            prompt = file.read()
    except Exception as e:
        print(f"プロンプトファイルの読み込み中にエラーが発生しました: {str(e)}")
        return
    
    print("Claudeにリクエストを送信中...")
    response = send_to_claude(prompt, file_paths)
    
    # 応答をファイルに保存
    print(save_response_to_file(response, output_file + ".txt"))
    
    # Pythonコードを抽出して保存
    python_code = extract_python_code(response)
    if python_code:
        print(save_response_to_file(python_code, output_file))
        print(f"抽出されたPythonコードを {output_file} に保存しました。")
    
    # 応答の一部も表示
    print("\n応答の一部:")
    print(response[:500] + "...\n")
    print(f"完全な応答は {output_file}.txt に保存されています。")

if __name__ == "__main__":
    main()