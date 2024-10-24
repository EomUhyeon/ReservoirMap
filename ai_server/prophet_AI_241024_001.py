import os
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import numpy as np
import glob

# 입력 폴더 및 출력 폴더 설정
input_folder = 'input_folder'  # CSV 파일이 있는 폴더 경로
output_folder = 'output_folder'  # 예측 결과를 저장할 폴더 경로

# 출력 폴더가 존재하지 않으면 생성
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# 입력 폴더에서 모든 CSV 파일 찾기
csv_files = glob.glob(os.path.join(input_folder, '*.csv'))

# 모든 CSV 파일에 대해 예측 수행
for file in csv_files:
    # 파일 이름만 추출하여 저장 파일 이름으로 사용
    file_name = os.path.splitext(os.path.basename(file))[0]  # 확장자를 제거한 파일 이름
    output_file = os.path.join(output_folder, f'{file_name}_예측결과.csv')

    # 데이터 로드
    data = pd.read_csv(file)

    # 데이터 구조 확인 (필요시 주석 처리)
    # print(f"Processing {file_name}")
    # print(data.head())

    # Prophet 데이터 준비
    data = data.rename(columns={'날짜': 'ds', '저수율': 'y'})     # '날짜'를 'ds'로, '저수율'을 'y'로 변경
    data['ds'] = pd.to_datetime(data['ds'])                      # 'ds' 열을 datetime 형식으로 변환

    # 최신 1825개의 데이터를 train으로 사용
    train_data = data.iloc[-1825:]

    # 모델 생성 및 학습
    model = Prophet()
    model.fit(train_data)

    # 90일 미래 예측
    future = model.make_future_dataframe(periods=90, include_history=False)
    forecast = model.predict(future)

    # 예측 결과를 0~100 사이로 제한하고 소수점 1자리까지 표시
    forecast['yhat'] = np.clip(forecast['yhat'], 0, 100)
    forecast['yhat'] = np.round(forecast['yhat'], 1)

    # 예측 결과 출력 (필요시 주석 처리)
    # print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

    # 예측 결과를 날짜, 저수율 형식으로 저장
    forecast_save = forecast[['ds', 'yhat']].rename(columns={'ds': '날짜', 'yhat': '저수율'})

    # CSV 파일로 저장
    forecast_save.to_csv(output_file, index=False, encoding='utf-8-sig')
    print(f'예측 결과가 {output_file} 파일로 저장되었습니다.')

    # 예측 결과 시각화
    # model.plot(forecast)
    # plt.title(f'90-Day Future Forecast for {file_name}')
    # plt.show()

    # 예측 성분 (트렌드, 주기성 등) 시각화
    # model.plot_components(forecast)
    # plt.show()
