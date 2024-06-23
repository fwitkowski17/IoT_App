import './DeviceState.css';
import Tile from "./shared/Tile";
import {useParams} from 'react-router-dom';
import {DataModel} from "../models/data.model.ts";
import {EntryModel} from "../models/entry.model.ts";

interface DeviceStateProps {
    data: DataModel[];
    showDeleteData: boolean;
}

const percentageDifferAllowed = 20

function DevicesState({data, showDeleteData} : DeviceStateProps) {
    let {id} = useParams();
    const checkSoDifferent = (array: EntryModel[]): boolean => {
        if(array.length < 2) return false
        const firstData = array[0];
        const lastData = array[1];

        const temperatureCalc = firstData.temperature - lastData.temperature
        const temperatureDiffPercentage = Math.abs(temperatureCalc) / (temperatureCalc/2) * 100;
        if(temperatureDiffPercentage > percentageDifferAllowed) return true;

        const humidityCalc = firstData.humidity - lastData.humidity
        const humidityDiffPercentage = Math.abs(humidityCalc) / (humidityCalc/2) * 100;
        if(humidityDiffPercentage > percentageDifferAllowed) return true;

        const pressureCalc = firstData.pressure - lastData.pressure
        const pressureDiffPercentage = Math.abs(pressureCalc) / (pressureCalc/2) * 100;
        return pressureDiffPercentage > percentageDifferAllowed;
    }

    return (
        <>
            {data &&
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: 'center'}}>
                {data.map(tile => {

                    const isActive = id !== undefined && tile.deviceId === +id;
                    return (
                        <div key={tile.deviceId} className="tile-device">
                            <Tile
                                id={tile.deviceId}
                                active={isActive}
                                hasData={Boolean(tile.latestEntries.length > 0)}
                                soDiff={checkSoDifferent(tile.latestEntries)}
                                showDelete={showDeleteData}
                                data={tile.latestEntries[0]}>
                            </Tile>
                        </div>
                    );
                })}
            </div>}
        </>
    )
}

export default DevicesState;
