import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Auth from '../../_hoc/auth'

const Maps = () => {


    const [state, setState] = useState({
        lat : 37.4858838,
        lng : 126.8973216,
        zoom : 16
    })

    const position = [state.lat, state.lng];

    return (
        <>
            <MapContainer style={{ height: "85vh" }} center={position} zoom={state.zoom}>
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker position={position}>
                    <Popup>
                        <span>입력</span>
                    </Popup>
                </Marker>
            </MapContainer>
        </>

    )
}

export default Auth(Maps, null)