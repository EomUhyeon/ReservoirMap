import pandas as pd

# 엑셀 파일 경로
excel_file_path = 'reservoir_241013.xls'

# 변환된 CSV 파일 저장 경로
csv_output_path = 'reservoir_selected_data.csv'

# 엑셀 파일에서 데이터 읽기
df = pd.read_excel(excel_file_path)

# '저수지명', '위치', '유효저수량' 순서로 열을 재배치하여 추출
reservoir_selected_df = df[['저수지명', '위치', '유효저수량']]

# 결과를 CSV 파일로 저장
reservoir_selected_df.to_csv(csv_output_path, index=False, encoding='utf-8-sig')

print(f"'저수지명', '위치', '유효저수량' 열이 {csv_output_path}로 저장되었습니다.")
