import pandas as pd

# 원본 CSV 파일 경로
csv_file_path = 'same_name_filtered_reservoirs.csv'

# CSV 파일 읽기
df = pd.read_csv(csv_file_path)

# 'name' 열만 추출
name_df = df[['name']]

# 결과를 새로운 CSV 파일로 저장
output_file_path = 'name_only.csv'
name_df.to_csv(output_file_path, index=False, encoding='utf-8-sig')

print(f"'name' 열만 포함된 데이터가 {output_file_path}에 저장되었습니다.")
