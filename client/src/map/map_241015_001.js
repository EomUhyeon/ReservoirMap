import React from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import MarkerData from './reservoir_maker_data.json';

function Map() {
    const start_point = [37.316946, 126.830447];
    const start_zoom = 13;

    return (
        <MapContainer center={start_point} zoom={start_zoom} className="map-size">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MarkerData.map((marker, index) => (
                <Marker
                    key={index}
                    position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
                >
                    <Popup>{marker.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default Map;
