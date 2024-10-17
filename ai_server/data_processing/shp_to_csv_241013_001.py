import geopandas as gpd

# .shp 파일 경로
shp_file_path = 'N3A_E0052114.shp'

# 변환된 CSV 파일 저장 경로
csv_output_path = 'N3A_E0052114.csv'

# .shp 파일을 읽어서 GeoDataFrame으로 변환
gdf = gpd.read_file(shp_file_path)

# GeoDataFrame을 CSV 파일로 저장 (인코딩을 'utf-8-sig'로 설정)
gdf.to_csv(csv_output_path, index=False, encoding='utf-8-sig')

print(f"CSV 파일이 {csv_output_path}로 저장되었습니다.")
