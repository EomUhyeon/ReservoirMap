import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';



function MapUploader({ get }) {
  const start_point = [37.316946, 126.830447];
  const [zoom, setZoom] = useState(13); // zoom 상태 관리

  // Zoom을 업데이트하는 자식 컴포넌트
    function ZoomUpdater({ zoom }) {
        const map = useMap(); // Leaflet 지도 객체를 가져옴
    
        useEffect(() => {
        map.setZoom(zoom); // Leaflet 지도의 줌을 강제로 설정
        }, [zoom, map]);
    
        return null;
  }
  useEffect(() => {
    const newZoomValue = get(); // Queue에서 값을 가져옴
    if (newZoomValue !== null) {
      console.log("test get");
      setZoom((prevZoom) => prevZoom + newZoomValue); // zoom 값을 업데이트
    }
  }, [get]);

  return (
    <MapContainer center={start_point} zoom={zoom} className="map-size">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomUpdater zoom={zoom} /> {/* zoom이 변경될 때마다 강제로 지도에 반영 */}
    </MapContainer>
  );
}

export default MapUploader;
