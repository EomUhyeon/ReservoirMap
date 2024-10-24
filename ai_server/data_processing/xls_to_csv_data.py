import pandas as pd

# 엑셀 파일 경로
excel_file_path = 'today_241023.xls'

# 변환된 CSV 파일 저장 경로
csv_output_path = 'today_241023.csv'

dataframes = pd.read_html(excel_file_path)

df = dataframes[0]  # 첫 번째 테이블 선택

# '저수지명', '위치', '유효저수량' 순서로 열을 재배치하여 추출
reservoir_selected_df = df[['저수지명', '저수율']]

# 결과를 CSV 파일로 저장
reservoir_selected_df.to_csv(csv_output_path, index=False, encoding='utf-8-sig')

print(f"'저수지명', '위치', '유효저수량' 열이 {csv_output_path}로 저장되었습니다.")
