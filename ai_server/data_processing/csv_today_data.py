import pandas as pd

# 1번 파일 (저수지명, 저수율) 읽기
file1_path = 'today_241023.csv'  # 저수지명, 저수율 데이터
df1 = pd.read_csv(file1_path)

# 2번 파일 (name) 읽기
file2_path = 'name_only.csv'  # name 데이터
df2 = pd.read_csv(file2_path)

# '저수지' 단어를 붙여서 매칭
df1['저수지명_with_suffix'] = df1['저수지명'] + '저수지'

# 1번 파일의 저수지명과 2번 파일의 name이 일치하는 항목만 필터링
merged_df = pd.merge(df2, df1, left_on='name', right_on='저수지명_with_suffix', how='inner')

# 필요한 열만 선택 (name, 저수율)
result_df = merged_df[['name', '저수율']]

# 결과를 새로운 CSV 파일로 저장
output_file_path = 'matching_today_241023.csv'
result_df.to_csv(output_file_path, index=False, encoding='utf-8-sig')

print(f"일치하는 저수지명과 저수율이 {output_file_path}에 저장되었습니다.")
