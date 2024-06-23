import './DeviceState.css';
import React, { useState, useEffect } from "react";
import serverConfig from "../server-config";
import DevicesState from "./DevicesState";
import { sortElemsByDeviceId } from "../utils/helper";
import Loader from "./shared/Loader";
import { DataModel, EntryModel } from "../models/data.model.ts";
import { Alert, Container, Snackbar } from "@mui/material";

function Home() {
    const [basicData, setBasicData] = useState<DataModel[] | null>(null);
    const [loaderState, setLoaderState] = useState(true);
    const [deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        fetchBasicData();
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

    return (
        <>
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
