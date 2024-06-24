import './DeviceState.css';
import React, { useState, useEffect } from "react";
import serverConfig from "../server-config";
import DevicesState from "./DevicesState";
import { sortElemsByDeviceId } from "../utils/helper";
import Loader from "./shared/Loader";
import { DataModel } from "../models/data.model.ts";
import {EntryModel} from "../models/entry.model.ts";
import { Alert, Container, Snackbar } from "@mui/material";
import Charts from "./Charts.tsx";
import {isExpired} from "react-jwt";

function Home() {
    const [basicData, setBasicData] = useState<DataModel[] | null>(null);
    const [hourData, setHourData] = useState<EntryModel[] | null>(null);
    const [loaderState, setLoaderState] = useState(true);
    const [deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        fetchBasicData();
        if(!isExpired(localStorage.getItem('token')))fetchHourData();
        const urlParams = new URLSearchParams(window.location.search);
        setDeleted(urlParams.get('deleted') === "true");
    }, []);

    const handleClose = () => {
        setDeleted(false);
    }

    const fetchBasicData = () => {
        setLoaderState(true);
        fetch(`${serverConfig.serverUrl}data/latest`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                setBasicData(sortElemsByDeviceId(data));
                setLoaderState(false);
            })
            .catch(error => {
                console.error('Error fetching basic data:', error);
                setLoaderState(false);
            });
    };

    const fetchHourData = () => {
        fetch(`${serverConfig.serverUrl}data/hour`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                setHourData(data);
            })
            .catch(error => {
                console.error('Error fetching extended data:', error);
                setLoaderState(false);
            });
    }

    return (
        <>
            {!loaderState && hourData && <div style={
                {
                    display: 'flex',
                    height: '50vh',
                    justifyContent: "center",
                    borderBottom: '10px solid #fff',
                    padding: '50px'
                }}>
                <Container maxWidth="lg">
                    <h2>Data summary from last hour</h2>
                    <Charts data={hourData}/>
                </Container>
            </div>}
            <div style={{ backgroundColor: '#000', display: 'flex', justifyContent: 'center' }}>
                {loaderState &&
                    <div style={{ marginTop: '50vh' }}>
                        <Loader />
                    </div>
                }
                {!loaderState && basicData && (
                    <Container maxWidth="lg">
                        <DevicesState data={basicData} showDeleteData={false} />
                    </Container>
                )}
            </div>
            <Snackbar open={deleted} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Account deleted successfully.
                </Alert>
            </Snackbar>
        </>
    )
}

export default Home;
