import * as React from 'react';
import Navbar from './components/Navbar';
import DeviceStatus from './components/DeviceStatus';
import Chart from "./components/Chart"
import './App.css';

function App() {
  
    // Example data for demonstration purposes
    const deviceData = {
        temperature: 23.5,
        pressure: 1013.25,
        humidity: 46,
    };

    const pData = [
        { x: '2024-05-26 11:00', y: 1013 },
        { x: '2024-05-26 12:00', y: 1012 },
        // Add more data points
    ];

    const uData = [
        { x: '2024-05-26 11:00', y: 45 },
        { x: '2024-05-26 12:00', y: 46 },
        // Add more data points
    ];

    const xLabels = ['2024-05-26 11:00', '2024-05-26 12:00']; // Assuming xLabels are the same for both pData and uData

    // Placeholder for device data while fetching
    const placeholderDeviceData = {
        temperature: "",
        pressure: "",
        humidity: "",
    };
    const tileCount: Number = import.meta.env.VITE_TILE_COUNT
    
    return (
        <div className="App">
            <Navbar />
            <header className='titleStyle'>
              <h1>Technologie webowe w Aplikacjach Internetu rzeczy</h1>
            </header>
            <div className="content">
                <div className="device-status">
                    <DeviceStatus data={deviceData} />
                </div>
                <div className="charts">
                    <Chart pData={pData} uData={uData} xLabels={xLabels} />
                </div>
            </div>
            <div className="separator"></div>
            <div className="other-devices">
                {/* Placeholder tiles for other devices */}
                {Array.from(Array(tileCount).keys()).map(index => (
                    <div className="device-tile" key={index}>
                        <h2>Device No. {index}</h2>
                        <p>Temperature: {placeholderDeviceData.temperature}</p>
                        <p>Pressure: {placeholderDeviceData.pressure}</p>
                        <p>Humidity: {placeholderDeviceData.humidity}</p>
                        <button className="details-button" >
                            Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;