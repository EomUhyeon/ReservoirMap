import pandas as pd

# CSV 파일 경로
csv_file_path = 'file2_with_lat_long.csv'

# CSV 파일 읽기
df = pd.read_csv(csv_file_path)

# '저수지명'이 중복된 경우 모두 삭제
df_filtered = df.groupby('name').filter(lambda x: len(x) == 1)

# 결과를 새로운 CSV 파일로 저장
output_file_path = 'same_name_filtered_reservoirs.csv'
df_filtered.to_csv(output_file_path, index=False, encoding='utf-8-sig')

print(f"중복된 저수지명이 제거된 데이터가 {output_file_path}에 저장되었습니다.")
