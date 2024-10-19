import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# 데이터 로드
data = pd.read_csv('가음저수지.csv')

# 데이터 구조 확인
print(data.head())

# Prophet 데이터 준비
data = data.rename(columns={'날짜': 'ds', '저수율': 'y'})     # '날짜'를 'ds'로, '저수율'을 'y'로 변경
data['ds'] = pd.to_datetime(data['ds'])                     # 'ds' 열을 datetime 형식으로 변환

train_data = data.iloc[:]

# 모델 생성 및 학습
model = Prophet()
model.fit(train_data)

# 예측
future = model.make_future_dataframe(periods=90, include_history=False)
forecast = model.predict(future)

# 예측 결과를 0~100 사이로 제한
forecast['yhat'] = np.clip(forecast['yhat'], 0, 100)

# 예측 결과 출력
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

# 예측 결과 시각화
model.plot(forecast)
plt.title('90-Day Future Forecast')
plt.show()

# 예측 성분 (트렌드, 주기성 등) 시각화
model.plot_components(forecast)
plt.show()
