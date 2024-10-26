import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import cropData from './data/crop_water_usage.json';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ReservoirGraph(reservoir_name) {
  const [data, setData] = useState([]);                       // 실제 저수율 데이터
  const [forecastData, setForecastData] = useState([]);       // 예측 저수율 데이터
  const [graphData, setGraphData] = useState({});
  const [reservoirName, setReservoirName] = useState('');
  const [recommendedCrop, setRecommendedCrop] = useState([]); // 추천 작물

  // 실제 저수율 데이터
  useEffect(() => {
    const reservoirNameStr = typeof reservoir_name === 'string' ? reservoir_name : reservoir_name?.reservoir_name;
    setReservoirName(reservoirNameStr);
    
    fetch(`https://35.193.25.157/api/reservoir_percent/${reservoirNameStr}`)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setData(result.data);                             // 실제 저수율 데이터 설정
            updateGraphData(result.data, null, 'daily');
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV data:', error);
      });
  }, [reservoir_name]);

  // 예측 저수율 데이터
  useEffect(() => {
    if (reservoirName) {
      fetch(`https://35.193.25.157/api/reservoir_forecast/${reservoirName}`)
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            complete: (result) => {
              setForecastData(result.data);                   // 예측 저수율 데이터 설정
              updateGraphData(data, result.data, 'daily');
              calculateAverageForecast(result.data);
            },
          });
        })
        .catch((error) => {
          console.error('Error fetching forecast CSV data:', error);
        });
    }
  }, [reservoirName, data]);

  // 예측 데이터 평균 계산 및 추천 작물 설정
  const calculateAverageForecast = (forecastData) => {
    if (forecastData && forecastData.length > 0) {
      // 유효한 숫자만 합산하기 위해 유효한 데이터 필터링
      const validData = forecastData.filter(curr => {
        const reservoirPercentStr = curr['저수율'] || curr['yhat'];
        const reservoirPercent = parseFloat(reservoirPercentStr?.replace(/[^0-9.]/g, '')); 
        return !isNaN(reservoirPercent);
      });
  
      if (validData.length === 0) {
        console.log("유효한 데이터가 없습니다.");
        return;
      }
  
      const sum = validData.reduce((acc, curr) => {
        const reservoirPercentStr = curr['저수율'] || curr['yhat'];
        const reservoirPercent = parseFloat(reservoirPercentStr?.replace(/[^0-9.]/g, '')); 
        return acc + (isNaN(reservoirPercent) ? 0 : reservoirPercent); // NaN인 경우 0으로 처리
      }, 0);
  
      const average = sum / validData.length;
      console.log("평균 저수율:", average);
  
      // 추천 작물 결정
      if (average >= 0 && average <= 30) {
        const randomIndex = Math.floor(Math.random() * cropData.low_water_usage.length);
        const randomCrop = cropData.low_water_usage[randomIndex];
        const secondIndex = (randomIndex + 1) % cropData.low_water_usage.length;
        const secondCrop = cropData.low_water_usage[secondIndex];
        setRecommendedCrop([randomCrop, secondCrop]);
      } 
      else if (average > 30 && average <= 60) {
        const randomIndex = Math.floor(Math.random() * cropData.medium_water_usage.length);
        const randomCrop = cropData.medium_water_usage[randomIndex];
        const secondIndex = (randomIndex + 1) % cropData.medium_water_usage.length;
        const secondCrop = cropData.medium_water_usage[secondIndex];
        setRecommendedCrop([randomCrop, secondCrop]);
      } 
      else if (average > 60 && average <= 100) {
        const randomIndex = Math.floor(Math.random() * cropData.high_water_usage.length);
        const randomCrop = cropData.high_water_usage[randomIndex];
        const secondIndex = (randomIndex + 1) % cropData.high_water_usage.length;
        const secondCrop = cropData.high_water_usage[secondIndex];
        setRecommendedCrop([randomCrop, secondCrop]);
      }
    }
  };

  // 데이터 필터링 (일간, 주간, 월간)
  const filterData = (data, mode) => {
    const filtered = [];
    const dataLength = data.length;

    if (mode === 'daily') {
      for (let i = dataLength - 2; i >= 0 && filtered.length < 365; i -= 1) {
        filtered.unshift(data[i]);
      }
    } 
    else if (mode === 'weekly') {
      for (let i = dataLength - 2; i >= 0 && filtered.length < 52; i -= 7) {
        filtered.unshift(data[i]);
      }
    } 
    else if (mode === 'monthly') {
      for (let i = dataLength - 2; i >= 0 && filtered.length < 12; i -= 30) {
        filtered.unshift(data[i]);
      }
    }
    return filtered;
  };

  // 그래프 데이터 업데이트
  const updateGraphData = useCallback((data, forecastData, mode) => {
    const filteredData = filterData(data, mode);
    const labels = filteredData.map((d) => d['날짜']);
    const values = filteredData.map((d) => parseFloat(d['저수율']));

    const datasets = [
      {
        label: `${reservoirName} 저수율 (%)`,
        data: values,
        borderColor: 'rgba(37, 143, 255, 1)', // 파란색
        backgroundColor: 'rgba(37, 143, 255, 0.2)',
        fill: true,
      },
    ];

    // 예측 데이터 추가
    if (forecastData) {
      const filteredForecastData = filterData(forecastData, mode);
      const forecastLabels = filteredForecastData.map((d) => d['날짜'] || d['ds']);
      const forecastValues = filteredForecastData.map((d) => parseFloat(d['저수율'] || d['yhat']));

      labels.push(...forecastLabels); // 예측 데이터 날짜 이어붙이기
      datasets.push({
        label: `${reservoirName} 예측 저수율 (%)`,
        data: [...Array(values.length-1).fill(null),...values.slice(-1), ...forecastValues], // 실제 데이터 뒤에 예측 데이터 이어붙임
        borderColor: 'rgba(255, 140, 37, 1)', // 주황색
        backgroundColor: 'rgba(255, 140, 37, 0.2)',
        fill: true,
      });
    }

    setGraphData({
      labels,
      datasets,
    });
  }, [reservoirName]);

  const handleModeChange = (mode) => {
    updateGraphData(data, forecastData, mode);
  };

  return (
    <div className="reservoir_graph_box">
      <div className='reservoir_bar'>
        {recommendedCrop.length > 0 && (
          <div className="recommended-crops">추천 작물 : 
            {recommendedCrop.map((crop, index) => (
              <div key={index} className="recommended-crop">
                <img src={crop.image} alt={crop.name} />
                <p>{crop.name}</p>
              </div>
            ))}
          </div>
        )}
        <div className="button-group">
          <button className="graph_button" onClick={() => handleModeChange('daily')}>일간</button>
          <button className="graph_button" onClick={() => handleModeChange('weekly')}>주간</button>
          <button className="graph_button" onClick={() => handleModeChange('monthly')}>월간</button>
        </div>
      </div>
      {graphData.labels ? (
        <div className='graph_box'>
          <Line
            data={graphData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  ticks: {
                    stepSize: 10, // 10단위로 표시
                    callback: function(value) { return `${value}%`; }, // % 기호 추가
                  },
                  title: {
                    display: true,
                    text: '저수율 (%)',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: '날짜',
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p>데이터 로딩중...</p>
      )}
    </div>
  );
}

export default ReservoirGraph;
