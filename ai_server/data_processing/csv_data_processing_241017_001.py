import pandas as pd

# 1번 파일 (저수지명, 위도, 경도) 읽기
file1_path = 'N3A_E0052114_filtered_central_coordinates.csv'
df1 = pd.read_csv(file1_path)

# 2번 파일 (저수지명, 위치, 유효저수량) 읽기
file2_path = 'reservoir_selected_data.csv'
df2 = pd.read_csv(file2_path)

# '저수지' 단어를 붙여서 매칭
def find_matching_data(reservoir_name):
    search_name = reservoir_name + '저수지'
    match = df1[df1['NAME'] == search_name]

    if not match.empty:
        return match.iloc[0]['NAME'], match.iloc[0]['latitude'], match.iloc[0]['longitude']
    else:
        return None, None, None

# 저수지명 옆에 위도, 경도, NAME 값 추가
df2['NAME'], df2['latitude'], df2['longitude'] = zip(*df2['저수지명'].apply(find_matching_data))

# 위도와 경도 값이 있는 항목만 필터링
df2_filtered = df2.dropna(subset=['latitude', 'longitude'])

# 'NAME', 'latitude', 'longitude', '위치', '유효저수량' 열로 데이터 구성
df_final = df2_filtered[['NAME', 'latitude', 'longitude', '위치', '유효저수량']]

# 결과를 CSV 파일로 저장
output_file_path = 'file2_with_lat_long.csv'
df_final.to_csv(output_file_path, index=False, encoding='utf-8-sig')

print(f"결과가 {output_file_path}로 저장되었습니다.")
