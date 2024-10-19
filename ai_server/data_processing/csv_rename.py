import pandas as pd

# CSV 파일 읽기
csv_file_path = 'name_only.csv'
df = pd.read_csv(csv_file_path)

# '저수지'라는 글자를 지우기
df['name'] = df['name'].str.replace('저수지', '')

# 수정된 데이터 확인
print(df)

# 수정된 파일을 저장 (원하는 경로에 맞게 지정)
output_file_path = 'rename_only.csv'
df.to_csv(output_file_path, index=False, encoding='utf-8-sig')
