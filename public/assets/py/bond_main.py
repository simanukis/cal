# ライブラリの設定
import glob         # フォルダ内のエクセルファイルを取得するためのライブラリ
import pandas as pd # エクセルなどのデータを操作するためのライブラリ
import os

# 所定フォルダ内の「*.xls」を取得
files=glob.glob('c:\\Users\\s-shimanukis\\Desktop\\somu\\test\\*.xls')

# 変数[list]を空リストで設定
list = []

# 取得したエクセルを一つずつpandasデータとして取得
for file in files:
    list.append(pd.read_excel(file))    # 変数[list]に各エクセルのデータを格納

# listに格納されたエクセルファイルをpandasとして結合
df = pd.concat(list, axis=1)    # データを横方向に結合

# エクセルファイルを書き出す
df.to_excel('c:\\Users\\s-shimanukis\\Desktop\\somu\\test\\syukeihyou.xls', index=False)  # 変数dfをエクセルに変換して「syukeihyou.xls」で保存する
