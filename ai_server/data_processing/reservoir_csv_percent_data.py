import os
import pandas as pd
import glob

# 1. 경로 설정
xls_folder_path = '2014-2023_data'  # XLS 파일이 들어 있는 폴더 경로
csv_file_path = 'rename_only.csv'  # 저수지 이름이 들어 있는 CSV 파일 경로
output_folder = 'output_folder'  # 결과물이 저장될 폴더 경로

# 결과물 저장 폴더가 없으면 생성
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# 2. CSV 파일 읽기
reservoir_names_df = pd.read_csv(csv_file_path)
reservoir_names = reservoir_names_df['name'].tolist()

# 3. XLS 파일 읽기
xls_files = glob.glob(os.path.join(xls_folder_path, '*.xls'))

# 4. 저수지 이름에 해당하는 데이터를 검색하고 저장
for reservoir_name in reservoir_names:
    result_data = []

    # 각 XLS 파일에서 데이터 검색
    for xls_file in xls_files:
        try:
            dataframes = pd.read_html(xls_file)
            df = dataframes[0]

            # 저수지명 열에서 해당 저수지 이름을 검색
            if '저수지명' in df.columns:
                matched_rows = df[df['저수지명'] == reservoir_name]

                # 해당 저수지의 날짜와 저수율을 가져오기
                for index, row in matched_rows.iterrows():
                    date = os.path.basename(xls_file).split('.')[0].split('_')[0]  # 파일명에서 날짜 추출
                    water_level = row['저수율']
                    result_data.append([date, water_level])

        except Exception as e:
            print(f"Error reading {xls_file}: {e}")

    # 5. 저수지별 결과를 저장
    if result_data:
        output_df = pd.DataFrame(result_data, columns=['날짜', '저수율'])
        output_file_path = os.path.join(output_folder, f'{reservoir_name}저수지.csv')
        output_df.to_csv(output_file_path, index=False, encoding='utf-8-sig')
        print(f'{reservoir_name} 결과 저장 완료: {output_file_path}')
    else:
        print(f'{reservoir_name}에 대한 데이터를 찾을 수 없습니다.')
