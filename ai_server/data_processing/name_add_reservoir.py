import pandas as pd

# CSV 파일 경로
csv_file_path = 'ko_name_reservoir.csv'  # 실제 파일 경로로 수정

# CSV 파일 읽기
df = pd.read_csv(csv_file_path)

# 'name' 열의 데이터 뒤에 're' 붙이기
df['name'] = df['name'] + 're'

# CSV 파일로 저장
output_file_path = 'test.csv'  # 저장할 파일 경로로 수정
df.to_csv(output_file_path, index=False)

# 결과 확인
print(df.head())
