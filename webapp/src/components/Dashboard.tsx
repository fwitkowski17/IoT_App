import { useEffect, useState} from 'react';
import DevicesState from "./DevicesState";
import CurrentState from "./CurrentState";
import Charts from "./Charts";
import serverConfig from "../server-config";
import {sortElemsByDeviceId} from "../utils/helper";
import {useParams} from "react-router-dom";
import Loader from "./shared/Loader";
import {EntryModel} from "../models/entry.model.ts";
import {Alert, Snackbar, ToggleButton, ToggleButtonGroup} from "@mui/material";

function Dashboard() {
    let {id} = useParams();
    const [data, setData] = useState<EntryModel[] | null>(null);
    const [lastItem, setLastItem] = useState(null);
    const [additionalAllData, setAdditionalAllData] = useState<EntryModel[] | null>(null);
    const [additionalFilteredData, setAdditionalFilteredData] = useState<EntryModel[] | null>(null);
    const [loaderState, setLoaderState] = useState(true);
    const [loaderChart, setLoaderChart] = useState(true);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [dataRange, setDataRange] = useState("all");

    useEffect(() => {
        fetchData();
        fetchAdditionalData();
        const urlParams = new URLSearchParams(window.location.search)
        setIsDeleted(urlParams.get('delete') === "true")
    }, [id]);

    const handleClose = () => {
        setIsDeleted(false)
    }

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        if (newAlignment !== null) {
            setDataRange(newAlignment);
        }
    };

    const fetchData = () => {
        setLoaderState(true);
        fetch(`${serverConfig.serverUrl}data/latest`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': localStorage.getItem('token')
            }})
            .then(response => response.json())
            .then((data: EntryModel[]) => {
                const sortedData = sortElemsByDeviceId([...data]);
                setData(sortedData);
                setLoaderState(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchAdditionalData = () => {
        setLoaderChart(true);
        fetch(`${serverConfig.serverUrl}data/${id}/30`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': localStorage.getItem('token')
            }})
            .then(response => response.json())
            .then(data => {
                setLastItem(data[data.length - 1])
                setAdditionalAllData(data);

                const now = new Date();
                const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

                const filteredData = data.filter(entry => {
                    const entryDate = new Date(entry.readingDate);
                    return entryDate >= oneHourAgo && entryDate <= now;
                });
                setAdditionalFilteredData(filteredData);
                setLoaderChart(false);
            })
            .catch(error => {
                console.error('Error fetching additional data:', error);
            });
    };

    return (
        <>
            <div style={
                {
                    display: 'flex',
                    height: '50vh',
                    alignItems: 'center',
                    justifyContent: "space-evenly",
                    borderBottom: '10px solid #fff',
                    padding: '50px'
                }}>
                <div>
                    {loaderChart && <Loader/>}
                    {!loaderChart && <>
                        <CurrentState data={lastItem}/>
                        <ToggleButtonGroup
                            color="primary"
                            value={dataRange}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                            sx={{marginTop: '10px'}}
                            fullWidth
                        >
                            <ToggleButton value="all">All data</ToggleButton>
                            <ToggleButton value="1hr">Last 1 hour</ToggleButton>
                        </ToggleButtonGroup>
                    </>
                    }
                </div>
                <div>
                    {loaderChart && <Loader/>}
                    {!loaderChart && additionalAllData && <>
                        {(dataRange == "all") ? <Charts data={additionalAllData} /> : <Charts data={additionalFilteredData} />}
                    </>}
                </div>

            </div>

            <div style={{backgroundColor: '#000', display: 'flex', justifyContent:'center'}}>
                {loaderState && <Loader/>}
                {!loaderState && data && <DevicesState data={data} showDeleteData={true}/>}
            </div>
            <Snackbar open={isDeleted} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={"success"} variant={"filled"} sx={{width: '100%'}}>Data successfully deleted from device!</Alert>
            </Snackbar>
        </>
    );
}

export default Dashboard;
