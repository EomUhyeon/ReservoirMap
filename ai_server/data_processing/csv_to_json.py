import csv
import json

# CSV 파일 경로와 변환할 JSON 파일 경로 설정
csv_file_path = 'reservoir_test_data.csv'  # 변환할 CSV 파일 이름
json_file_path = 'reservoir_test_data.json'  # 저장될 JSON 파일 이름

# CSV 파일 읽기
with open(csv_file_path, mode='r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    data = [row for row in csv_reader]

# JSON 파일 쓰기
with open(json_file_path, mode='w', encoding='utf-8') as json_file:
    json.dump(data, json_file, indent=4, ensure_ascii=False)

print(f'{csv_file_path} 파일이 {json_file_path}로 변환되었습니다.')
