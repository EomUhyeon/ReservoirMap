import React, { useEffect, useState } from "react"; 
import "./menu.css";
import ReservoirData from './reservoir_data.json';
import cropData from './crop_water_usage.json';
import TodayPercent from './reservoir_today_percent.json';
import NationwideStatus from "./nationwide_status.js";
import ReservoirGraph from './reservoir_graph.js';

function Menu({ putSearch, getPopup, isEmptyPopup }) {
    const [menuOpen, setMenuOpen] = useState(true);
    const left_menu = menuOpen ? 'left_menu' : 'left_menu left_menu_closed';
    const [reservoirInformation, setReservoirInformation] = useState([]);
    const [activeTab, setActiveTab] = useState("전국 현황");

    useEffect(() => {
        if (!isEmptyPopup()) {
            const popupData = getPopup();
            setReservoirInformation(popupData);
        }
    }, [getPopup, isEmptyPopup]);

    const leftMenuBnt = () => {  
        setMenuOpen(!menuOpen);
    };

    function Search() {
        const [searchTerm, setSearchTerm] = useState("");
    
        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };
    
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                searchReservoir();
            }
        };

        const handleSearchClick = () => {
            searchReservoir();
        };

        const searchReservoir = () => {
            const filteredReservoirs = ReservoirData.filter((reservoir) =>
                reservoir.name.includes(searchTerm)
            );
            if (filteredReservoirs.length > 0) {
                putSearch(filteredReservoirs[0].name);  // 첫 번째 결과 선택
            }
        };
    
        const filteredReservoirs = searchTerm
            ? ReservoirData.filter((reservoir) =>
                reservoir.name.includes(searchTerm)
                ).slice(0, 10)
            : [];

        const handleReservoirClick = (reservoir) => {
            putSearch(reservoir.name);  
        };

        const percentCategory = (name) => {
            const reservoir = TodayPercent.find(item => item.name === name);
    
            if (!reservoir || !reservoir.percent) {
                return '';
            }
    
            const percent = parseFloat(reservoir.percent);
    
            if (percent >= 0 && percent <= 20) {
                return 'marker-20';
            } else if (percent > 20 && percent <= 40) {
                return 'marker-40';
            } else if (percent > 40 && percent <= 60) {
                return 'marker-60';
            } else if (percent > 60 && percent <= 80) {
                return 'marker-80';
            } else if (percent > 80 && percent <= 100) {
                return 'marker-100';
            } else {
                return '';
            }
        };

        return (
            <div className="search_box">
                <div className="search_bar">
                    <input
                        className="search_window"
                        type="text"
                        placeholder="저수지를 검색 하세요."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyPress} 
                    />
                    <button className="search_bnt" onClick={handleSearchClick}></button>
                </div>
                <div className="search_data_box">
                    {searchTerm && (
                        <ul className="search_results_box">
                            {filteredReservoirs.length > 0 ? (
                                filteredReservoirs.map((reservoir, index) => (
                                    <div className="search_result">
                                        <div className={`today_persent ${percentCategory(reservoir.name)}`}></div>
                                        <li key={index} onClick={() => handleReservoirClick(reservoir)}>
                                            {reservoir.name} ({reservoir.위치})
                                        </li>
                                    </div>
                                ))
                            ) : (
                                <li className="search_result">결과가 없습니다.</li>
                            )}
                        </ul>
                    )}
                </div>            
            </div>    
        );
    }

    // 작물 정보 페이지
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

    // 상세 정보 페이지
    function ReservoirDetails() {
        return (
            <div>
                <div className="reservoir_information_box">
                    {reservoirInformation.length > 0 && (
                        <div className="table_menu">
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>이름</strong></td>
                                        <td>{reservoirInformation[0]}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>유효 저수량</strong></td>
                                        <td>{reservoirInformation[1]} m³</td>
                                    </tr>
                                    <tr>
                                        <td><strong>금일 저수량</strong></td>
                                        <td>{reservoirInformation[2]}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>금일 저수율</strong></td>
                                        <td>{reservoirInformation[3]}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>소재지</strong></td>
                                        <td>{reservoirInformation[4]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {reservoirInformation.length > 0 ? (
                    <ReservoirGraph reservoir_name={reservoirInformation[0]} />
                ) : (
                    <p>저수지 정보를 선택해주세요.</p>
                )}
            </div>
        );
    }

    return (
        <div className={left_menu}>
            <button className="left_menu_btn" onClick={leftMenuBnt}>
                <div className={`arrow ${menuOpen ? 'open' : ''}`}></div>
            </button>
            <div className="left_menu_top">
                <Search />
            </div>
            <div className="left_menu_mid">
            <button 
                    className={`left_menu_mid_bnt ${activeTab === "전국 현황" ? "active" : ""}`} 
                    onClick={() => setActiveTab("전국 현황")}
                >
                    전국 현황
                </button>
                <button 
                    className={`left_menu_mid_bnt ${activeTab === "상세 정보" ? "active" : ""}`} 
                    onClick={() => setActiveTab("상세 정보")}
                >
                    상세 정보
                </button>
                <button 
                    className={`left_menu_mid_bnt ${activeTab === "작물 정보" ? "active" : ""}`} 
                    onClick={() => setActiveTab("작물 정보")}
                >
                    농작물 정보
                </button>
                <hr className="gray-line"></hr>
            </div>
            <div className="left_menu_bot">
                {activeTab === "전국 현황" && <NationwideStatus />}
                {activeTab === "상세 정보" && <ReservoirDetails />}
                {activeTab === "작물 정보" && <CropInformation />}
            </div>
        </div>
    );
}

export default Menu;
