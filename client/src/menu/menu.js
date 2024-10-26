import React, { useEffect, useState } from "react"; 
import "./css/menu.css";
import ReservoirData from './data/reservoir_data.json';
import TodayPercent from './data/reservoir_today_percent.json';
import NationwideStatus from "./nationwide_status.js";
import ReservoirGraph from './reservoir_graph.js';
import CropInformation from "./crop_information.js";

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

    // 저수지 검색창
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
