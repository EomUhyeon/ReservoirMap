import pandas as pd

# CSV 파일 경로
csv_file_path = 'N3A_E0052114.csv'

# CSV 파일의 상위 10줄을 출력
df = pd.read_csv(csv_file_path)

# 상위 10줄 출력
print(df.head(10))
