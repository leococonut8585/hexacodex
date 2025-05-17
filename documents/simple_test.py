import anthropic

# APIキーを直接記述
api_key = "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"

# Anthropicクライアントを初期化
client = anthropic.Anthropic(api_key=api_key)

# テスト
try:
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=100,
        messages=[
            {"role": "user", "content": "こんにちは"}
        ]
    )
    print("成功！")
    print(message.content[0].text)
except Exception as e:
    print(f"エラー: {str(e)}")

# プログラムが終了しないようにユーザー入力を待つ
input("\n何かキーを押すと終了します...")