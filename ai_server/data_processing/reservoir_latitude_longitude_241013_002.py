import geopandas as gpd

# .shp 파일 경로
shp_file_path = 'N3A_E0052114.shp'

# 변환된 CSV 파일 저장 경로
csv_output_path = 'N3A_E0052114_filtered_central_coordinates.csv'

# .shp 파일을 읽어서 GeoDataFrame으로 변환
gdf = gpd.read_file(shp_file_path)

# 좌표계 확인 및 변환 (WGS84로 변환: EPSG:4326)
if gdf.crs is None:
    print("좌표계 정보가 없습니다. 좌표계가 정의되지 않은 경우 올바른 좌표계를 지정해야 합니다.")
else:
    print(f"현재 좌표계: {gdf.crs}")

    # 좌표계가 WGS84가 아니라면 변환
    if gdf.crs != 'EPSG:4326':
        gdf = gdf.to_crs(epsg=4326)
        print("좌표계를 WGS84로 변환했습니다.")


# 중앙 좌표(위도, 경도)를 계산하는 함수
def get_centroid(geometry):
    try:
        if geometry.is_empty:
            return None, None  # 빈 지오메트리 필터링
        centroid = geometry.centroid
        return centroid.y, centroid.x  # 위도, 경도 순으로 반환
    except Exception as e:
        print(f"지오메트리에서 좌표를 계산하는 중 오류 발생: {e}")
        return None, None


# NAME 값이 없거나 geometry가 없는 행 제거
gdf = gdf.dropna(subset=['NAME', 'geometry'])

# NAME과 중앙 좌표만 추출
gdf['latitude'], gdf['longitude'] = zip(*gdf['geometry'].apply(get_centroid))
output_df = gdf[['NAME', 'latitude', 'longitude']]

# 중앙 좌표 계산에 실패한 항목 제거
output_df = output_df.dropna(subset=['latitude', 'longitude'])

# 결과를 CSV 파일로 저장
output_df.to_csv(csv_output_path, index=False, encoding='utf-8-sig')

print(f"필터링된 CSV 파일이 {csv_output_path}로 저장되었습니다.")
