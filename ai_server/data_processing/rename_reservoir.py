import pandas as pd

# CSV 파일 경로
csv_file_path = 'ko_name_reservoir.csv'  # 실제 파일 경로로 수정

# CSV 파일 읽기
df = pd.read_csv(csv_file_path)

# '저수지'를 name 열에서 제거
df['name'] = df['name'].str.replace('저수지', '', regex=False)

# CSV 파일로 저장
output_file_path = 'ko_name.csv'  # 저장할 파일 경로로 수정
df.to_csv(output_file_path, index=False, encoding='utf-8-sig')

# 결과 확인
print(df.head())
