import React, { useRef, useEffect } from 'react';
import './Map.css';

const Map = props => {
    const mapRef = useRef();

    // object destructuring - take center and zoom from props
    const { center, zoom } = props

    useEffect(() => {
        // acces to maps by window
        // two argument - where display, what display
        const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });
        // creating marker in center of the map  
        new window.google.maps.Marker({ position: center, map: map });
    }, [center, zoom]);


    return (
        <div ref={mapRef}
            className={`map ${props.className}`}
            style={props.style}>

        </div>
    );
};
export default Map;