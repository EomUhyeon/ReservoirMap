import React from 'react';
import { MapContainer,TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';


function MapUploader() {
    const start_point = [37.316946, 126.830447];
    const start_zoom = 13;

    function MapLoad({ children }){
        return (
            <MapContainer center={start_point} zoom={start_zoom} className="map-size">
                <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {children}
            </MapContainer>
        );
    };

    return (
        <>
            <MapLoad/>
        </>
    );
};

export default MapUploader;
