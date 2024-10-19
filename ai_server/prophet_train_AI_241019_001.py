import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# 데이터 로드
data = pd.read_csv('가음저수지.csv')

# 데이터 구조 확인
print(data.head())

# Prophet이 요구하는 형식으로 데이터 준비
data = data.rename(columns={'날짜': 'ds', '저수율': 'y'})  # '날짜'를 'ds'로, '저수율'을 'y'로 변경
data['ds'] = pd.to_datetime(data['ds'])  # 'ds' 열을 datetime 형식으로 변환

# 학습 데이터와 테스트 데이터 분리 (마지막 30일을 테스트 데이터로 사용)
train_data = data.iloc[:-30]  # 학습 데이터는 마지막 30일을 제외한 나머지
test_data = data.iloc[-30:]   # 마지막 30일 데이터

# 모델 생성 및 학습
model = Prophet()
model.fit(train_data)

# 30일 미래 예측
future = model.make_future_dataframe(periods=30, include_history=False)
forecast = model.predict(future)

# 예측 결과를 0~100 사이로 제한
forecast['yhat'] = np.clip(forecast['yhat'], 0, 100)

# 예측 결과 출력
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

# 예측 결과 시각화
model.plot(forecast)
plt.title('30-Day Future Forecast')
plt.show()

# 실제 값과 예측 값 비교 및 정확도 계산
y_true = test_data['y'].values
y_pred = forecast['yhat'].values

# MAE와 MSE 계산
mae = mean_absolute_error(y_true, y_pred)
mse = mean_squared_error(y_true, y_pred)

print(f'Mean Absolute Error (MAE): {mae}')
print(f'Mean Squared Error (MSE): {mse}')

# R-squared 계산
r2 = r2_score(y_true, y_pred)
print(f'R-squared (R2): {r2}')

# MAPE 계산
mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
print(f'Mean Absolute Percentage Error (MAPE): {mape}%')

# 예측 정확도 계산
accuracy = 100 - mape
print(f'예측 정확도: {accuracy}%')

# 예측 성분 (트렌드, 주기성 등) 시각화
model.plot_components(forecast)
plt.show()
