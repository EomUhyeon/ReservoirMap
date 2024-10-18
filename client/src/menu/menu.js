import React, { useEffect, useState } from "react"; 
import "./menu.css";
import ReservoirData from './reservoir_data.json';

function Menu({ putSearch, getPopup, isEmptyPopup }) {
    const [menuOpen, setMenuOpen] = useState(true);
    const left_menu = menuOpen ? 'left_menu' : 'left_menu left_menu_closed';
    const [reservoirInformation, setReservoirInformation] = useState([]);

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

        return (
            <>
            <div className="search_box">
                <input
                    type="text"
                    placeholder="저수지 검색..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress} 
                    className="search_bar"
                />
                <button className="search_bnt" onClick={handleSearchClick}></button>
            </div>    
            <div>
                {searchTerm && (
                    <ul className="search-results">
                        {filteredReservoirs.length > 0 ? (
                            filteredReservoirs.map((reservoir, index) => (
                                <li key={index} onClick={() => handleReservoirClick(reservoir)}>
                                    {reservoir.name} ({reservoir.위치})
                                </li>
                            ))
                        ) : (
                            <li>결과가 없습니다.</li>
                        )}
                    </ul>
                )}
            </div>
            </>
        );
    }

    return (
        <div className={left_menu}>
            <button className="left_menu_btn" onClick={leftMenuBnt}>
            {menuOpen ? "<" : ">"}
            </button>
            <Search />
            <hr className="gray-line"></hr>
            <div className="reservoir_information_box">
                {reservoirInformation.length > 0 && (
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>이름 :</strong></td>
                                <td>{reservoirInformation[0]}</td>
                            </tr>
                            <tr>
                                <td><strong>유효 저수량 :</strong></td>
                                <td>{reservoirInformation[1]} m³</td>
                            </tr>
                            <tr>
                                <td><strong>금일 저수량 :</strong></td>
                                <td>{reservoirInformation[2]}</td>
                            </tr>
                            <tr>
                                <td><strong>금일 저수율 :</strong></td>
                                <td>{reservoirInformation[3]}</td>
                            </tr>
                            <tr>
                                <td><strong>소재지 :</strong></td>
                                <td>{reservoirInformation[4]}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Menu;
