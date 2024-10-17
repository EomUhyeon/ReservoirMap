import pandas as pd

# HTML 파일 경로
html_file_path = 'reservoir_241013.xls'

# 변환된 CSV 파일 저장 경로
csv_output_path = 'reservoir_names.csv'

# HTML 파일에서 테이블 데이터 읽기
dataframes = pd.read_html(html_file_path)

# HTML 파일에 여러 개의 테이블이 있을 수 있으므로, 첫 번째 테이블을 선택합니다.
df = dataframes[0]  # 첫 번째 테이블 선택

# '저수지명'이라는 열만 추출 (실제 열 이름이 다를 수 있으니 확인 후 수정)
reservoir_names_df = df[['저수지명']]

# 결과를 CSV 파일로 저장
reservoir_names_df.to_csv(csv_output_path, index=False, encoding='utf-8-sig')

print(f"'저수지명' 열이 {csv_output_path}로 저장되었습니다.")
