import React from 'react';
import '../Styles/compass.css'; 

function Compass({ windDirection }) {
    const calculateRotationAngle = () => {

        switch (windDirection.toUpperCase()) {
            case 'N':
                return 0 + 180;
            case 'NNE':
                return 22.5 + 180;
            case 'NE':
                return 45 + 180;
            case 'ENE':
                return 67.5 + 180;
            case 'E':
                return 90 + 180;
            case 'ESE':
                return 112.5 + 180;
            case 'SE':
                return 135 + 180;
            case 'SSE':
                return 157.5 + 180;
            case 'S':
                return 180 + 180;
            case 'SSW':
                return 202.5 + 180;
            case 'SW':
                return 225 + 180;
            case 'WSW':
                return 247.5 + 180;
            case 'W':
                return 270 + 180;
            case 'WNW':
                return 292.5 + 180;
            case 'NW':
                return 315 + 180;
            case 'NNW':
                return 337.5 + 180;
            default:
                return 0;
        }
    };

    return (
        <div className="compass">
            <div className="arrow" style={{ transform: `translateX(-50%) translateY(-50%) rotate(${calculateRotationAngle()}deg)` }}>

            </div>
            <div className="direction N">N</div>
            <div className="direction E">E</div>
            <div className="direction S">S</div>
            <div className="direction W">W</div>
        </div>
    );
}

export default Compass;
