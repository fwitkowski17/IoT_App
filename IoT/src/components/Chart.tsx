import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

interface ChartsProps {
    pData: { x: string, y: number }[];
    uData: { x: string, y: number }[];
    xLabels: string[];
}

const Chart: React.FC<ChartsProps> = ({ pData, uData }) => {
    const pressureData = pData.map(item => item.y);
    const humidityData = uData.map(item => item.y);
    const xLabels = pData.map(item => item.x); // Assuming xLabels are the same for both pData and uData


    return (
        <LineChart
            width={500}
            height={300}
            series={[
                { data: pressureData, label: 'Pressure' },
                { data: humidityData, label: 'Humidity' },
            ]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
    );
};

export default Chart;
