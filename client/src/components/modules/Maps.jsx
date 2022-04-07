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
                    url='http://xdworld.vworld.kr:8080/2d/Base/201710/{z}/{x}/{y}.png'
                    maxZoom={18}
                    minZoom={8}
                />
                {/* <Marker position={position}>
                    <Popup>
                        <span>입력</span>
                    </Popup>
                </Marker> */}
            </MapContainer>
        </>

    )
}

export default Auth(Maps, null)