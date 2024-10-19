import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './menu.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ReservoirGraph(reservoir_name) {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [reservoirName, setReservoirName] = useState('');

  useEffect(() => {
    const reservoirNameStr = typeof reservoir_name === 'string' ? reservoir_name : reservoir_name?.reservoir_name;
    setReservoirName(reservoirNameStr);
    // 서버에서 CSV 파일 가져오기
    fetch('http://localhost:8080/api/reservoir_percent/' + reservoirName)
      .then((response) => response.text())
      .then((csvText) => {
        // PapaParse로 CSV 텍스트를 파싱
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setData(result.data);
            updateGraphData(result.data, 'daily');
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV data:', error);
      });
  }, [reservoir_name, reservoirName]);

  // 일간, 주간, 월간 데이터 필터링
  const filterData = (data, mode) => {
    const filtered = [];
    const dataLength = data.length;

    if (mode === 'daily') {
      return data.slice(-450);
    } 
    else if (mode === 'weekly') {
      for (let i = dataLength - 2; i >= 0 && filtered.length < 64; i -= 7) {
        filtered.unshift(data[i]);
      }
    } 
    else if (mode === 'monthly') {
      for (let i = dataLength - 2; i >= 0 && filtered.length < 15; i -= 30) {
        filtered.unshift(data[i]);
      }
    }
    return filtered;
  };

  // 그래프 데이터 업데이트
  const updateGraphData = useCallback((data, mode) => {
    const filteredData = filterData(data, mode);
    const labels = filteredData.map((d) => d['날짜']);
    const values = filteredData.map((d) => parseFloat(d['저수율']));

    setGraphData({
      labels,
      datasets: [
        {
          label: reservoirName+' 저수율 (%)',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    });
  }, [reservoirName]);

  const handleModeChange = (mode) => {
    updateGraphData(data, mode);
  };

  return (
    <div className="reservoir_graph_box">
      <div className="button-group">
        <button className="graph_button" onClick={() => handleModeChange('daily')}>일간</button>
        <button className="graph_button" onClick={() => handleModeChange('weekly')}>주간</button>
        <button className="graph_button" onClick={() => handleModeChange('monthly')}>월간</button>
      </div>
      {graphData.labels ? (
        <div style={{ width: '90%', height: '400px' }}>
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
