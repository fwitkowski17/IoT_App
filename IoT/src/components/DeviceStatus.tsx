import * as React from 'react';
import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OpacityIcon from '@mui/icons-material/Opacity';

interface DeviceStatusProps {
    data: {
        temperature: number;
        pressure: number;
        humidity: number;
    };
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ data }) => {
    const hasData = data && data.temperature !== undefined && data.pressure !== undefined && data.humidity !== undefined;

    return (
        <div className="device-status-tile">
            {hasData && (
                <Typography style={{paddingTop: '10px'}} component="div">
                    <h1>Device No. 3</h1>
                    <Typography variant="h6" component="div">
                        <DeviceThermostatIcon/>
                        <span className="value">{data.temperature}</span> <span>&deg;C</span>
                    </Typography>
                    <Typography variant="h6" component="div">
                        <CloudUploadIcon/>
                        <span className="value">{data.pressure}</span> hPa
                    </Typography>
                    <Typography variant="h6" component="div">
                        <OpacityIcon/>
                        <span className="value">{data.humidity}</span>%
                    </Typography>
                </Typography>
            )}
        </div>
    );
};

export default DeviceStatus;