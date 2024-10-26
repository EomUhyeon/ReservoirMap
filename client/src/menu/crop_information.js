import React, { useState } from "react"; 
import cropData from './data/crop_water_usage.json';

function CropInformation() {
    const [searchTerm, setSearchTerm] = useState('');
    const [waterUsageFilter, setWaterUsageFilter] = useState(''); // high, medium, low

    // 물 사용량에 따른 데이터 필터링
    const getFilteredData = () => {
        let filteredData = [];
        
        if (waterUsageFilter === 'high') {
            filteredData = cropData.high_water_usage;
        } 
        else if (waterUsageFilter === 'medium') {
            filteredData = cropData.medium_water_usage;
        } 
        else if (waterUsageFilter === 'low') {
            filteredData = cropData.low_water_usage;
        } 
        else {
            // 필터가 설정되지 않은 경우 모든 데이터를 표시
            filteredData = [
                ...cropData.high_water_usage,
                ...cropData.medium_water_usage,
                ...cropData.low_water_usage
            ];
        }

        // 검색어가 있으면 검색어 필터 적용
        if (searchTerm) {
            filteredData = filteredData.filter(crop =>
                crop.name.includes(searchTerm)
            );
        }

        return filteredData;
    };

    const filteredCrops = getFilteredData(); // 필터링된 데이터

    return (
        <div className="crop-info-container">
            <div className="crop_search_box">
                <input
                    type="text"
                    placeholder="작물을 검색 하세요."
                    className="crop_search_window"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="crop_filter_buttons">물 사용량 : 
                    <button className="crop_water_high" onClick={() => setWaterUsageFilter('high')}>많음</button>
                    <button className="crop_water_medium" onClick={() => setWaterUsageFilter('medium')}>보통</button>
                    <button className="crop_water_low" onClick={() => setWaterUsageFilter('low')}>적음</button>
                    <button className="crop_water_all" onClick={() => setWaterUsageFilter('')}>전체</button>
                </div>
            </div>
            <div className="crop_table">
                <table>
                    <thead>
                        <tr>
                            <th>이미지</th>
                            <th>이름</th>
                            <th>물 사용량</th>
                            <th>성장 기간</th>
                            <th>적정 온도</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCrops.map((crop, index) => (
                            <tr key={index}>
                                <td>
                                    <img src={crop.image} alt={crop.name} style={{ width: '100px', height: '100px' }} />
                                </td>
                                <td>{crop.name}</td>
                                <td>{crop.water_usage}</td>
                                <td>{crop.growth_duration}</td>
                                <td>{crop.optimal_temperature}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CropInformation;
