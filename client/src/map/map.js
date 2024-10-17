import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import ReservoirData from './reservoir_data.json';
import TodayPercent from './reservoir_today_percent';

function Map({ getSearch, isEmptySearch, putPopup }) {
    const start_point = [37.316946, 126.830447];
    const start_zoom = 13;
    const [searchReservoir, setSearchReservoir] = useState(null);
    const markersRef = useRef({});

    useEffect(() => {
        if (!isEmptySearch()) {
            const reservoirName = getSearch();
            const reservoir = ReservoirData.find(r => r.name === reservoirName);

            if (reservoir) {
                const lat = parseFloat(reservoir.latitude);
                const lng = parseFloat(reservoir.longitude);
                setSearchReservoir({ name: reservoir.name, position: [lat, lng] });
            }
        }
    }, [getSearch, isEmptySearch]);

    const MapHandler = ({ searchReservoir }) => {
        const map = useMap();

        useEffect(() => {
            if (searchReservoir && markersRef.current[searchReservoir.name]) {
                map.setView(searchReservoir.position, 13);
                markersRef.current[searchReservoir.name].openPopup();
            }
        }, [searchReservoir, map]);

        return null;
    }

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

    const getTodayData = (name, 유효저수량) => {
        const reservoir = TodayPercent.find(item => item.name === name);

        if (!reservoir || !reservoir.percent) {
            return { 저수율: '데이터 불러오는중 ...', 저수량: '데이터 불러오는중 ...' };
        }

        const percent = parseFloat(reservoir.percent);
        const 저수량 = (유효저수량 * percent) / 100; // 금일 저수량 계산
        return { 저수율: `${percent}%`, 저수량: `${저수량.toFixed(2)} m³` };
    };

    const handlePopupOpen = (name, 유효저수량, 저수량, 저수율, 위치) => {
        const popupdata = [name, 유효저수량, 저수량, 저수율, 위치]
        putPopup(popupdata);
    };

    return (
        <MapContainer center={start_point} zoom={start_zoom} className="map-size">
            <MapHandler searchReservoir={searchReservoir} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {ReservoirData.map((marker, index) => {
                const 유효저수량 = parseFloat(marker.유효저수량);
                const { 저수율, 저수량 } = getTodayData(marker.name, 유효저수량);

                return (
                    <Marker
                        icon={new L.DivIcon({
                            className: `custom-marker ${percentCategory(marker.name)}`,
                            iconSize: [20, 20],         // 크기
                            iconAnchor: [10, 10],       // 원의 중심 설정
                            popupAnchor: [2, -10],      // 팝업 위치
                        })}
                        key={index}
                        position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
                        ref={(el) => {
                            if (el) {
                                markersRef.current[marker.name] = el;
                            }
                        }}
                        eventHandlers={{
                            popupopen: () => handlePopupOpen(marker.name, marker.유효저수량, 저수량, 저수율, marker.위치)
                        }}
                    >
                        <Popup>
                            이름 : {marker.name}<br />
                            유효 저수량 : {marker.유효저수량} m³<br />
                            금일 저수량 : {저수량}<br />
                            금일 저수율 : {저수율}<br />
                            소재지 : {marker.위치}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

export default Map;
