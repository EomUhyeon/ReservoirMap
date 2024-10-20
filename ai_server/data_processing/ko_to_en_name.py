import pandas as pd
from korean_romanizer.romanizer import Romanizer

# CSV 파일 경로
csv_file_path = 'name_only.csv'  # 실제 파일 경로로 수정

# CSV 파일 읽기
df = pd.read_csv(csv_file_path)

# 한국어를 로마자로 변환
df['name'] = df['name'].apply(lambda x: Romanizer(x).romanize())

# CSV 파일로 저장
output_file_path = 'ko_name_only.csv'  # 저장할 파일 경로로 수정
df.to_csv(output_file_path, index=False, encoding='utf-8-sig')

# 결과 확인
print(df.head())
