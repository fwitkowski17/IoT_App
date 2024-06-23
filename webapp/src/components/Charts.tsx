import {LineChart} from '@mui/x-charts/LineChart';
import {EntryModel} from "../models/entry.model.ts";
import {Alert, AlertTitle} from "@mui/material";

interface ChartsProps {
    data: EntryModel[];
}
function Charts({data}: ChartsProps) {
    const chartData = data || [].map((item: EntryModel) => ({
        temperature: item.temperature,
        pressure: item.pressure,
        humidity: item.humidity,
        readingDate: new Date(item.readingDate).toISOString()
    }));

    const xLabels = chartData && chartData.map(item => new Date(item.readingDate).toLocaleString());

    if (!data?.length) {
        return (
            <>
                <Alert severity="warning"><AlertTitle>No data from this device/time range!</AlertTitle></Alert>
            </>
        )
    }

    return (
        <>
            {data && <LineChart
                width={1000}
                height={300}
                series={[
                    {data: chartData.map((item:EntryModel) => item.pressure !== undefined ? item.pressure/10 : null), label: 'Pressure x10 [hPa]'},
                    {data: chartData.map((item:EntryModel) => item.humidity !== undefined ? item.humidity : null), label: 'Humidity [%]'},
                    {data: chartData.map((item:EntryModel) => item.temperature !== undefined ? item.temperature : null), label: 'Temperature [°C]'},
                ]}
                xAxis={[{scaleType: 'point', data: xLabels}]}
            />}
        </>
    );
}

export default Charts;
