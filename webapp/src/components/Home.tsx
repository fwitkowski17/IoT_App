import './DeviceState.css';
import React, {useState, useEffect} from "react";
import serverConfig from "../server-config";
import DevicesState from "./DevicesState";
import {sortElemsByDeviceId} from "../utils/helper";
import Loader from "./shared/Loader";
import {DataModel} from "../models/data.model.ts";
import {Alert, Container, Snackbar} from "@mui/material";

function Home() {

    const [data, setData] = useState<DataModel[] | null>(null);
    const [loaderState, setLoaderState] = useState(true);
    const [deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
        const urlParams = new URLSearchParams(window.location.search)
        setDeleted(urlParams.get('deleted') === "true")
    }, []);

    const handleClose = () => {
        setDeleted(false);
    }

    const fetchData = () => {
        setLoaderState(true);
        fetch(`${serverConfig.serverUrl}data/latest`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(sortElemsByDeviceId(data));
                setLoaderState(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    return (
        <>
            <div style={{backgroundColor: '#000', display: 'flex', justifyContent: 'center'}}>
                {loaderState &&
                    <div style={{marginTop: '50vh'}}>
                        <Loader/>
                    </div>
                }
                {!loaderState && data && <Container maxWidth="ld">
                    <div style={
                        {
                            display: 'flex',
                            height: '40vh',
                            alignItems: 'center',
                            justifyContent: "space-evenly",
                            borderBottom: '10px solid #fff',
                            padding: '50px'
                        }}>

                    </div>
                        <DevicesState data={data} showDeleteData={false}/>
                </Container>}
            </div>
            <Snackbar open={deleted} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={"success"} variant={"filled"} sx={{width: '100%'}}>Account deleted successfully.</Alert>
            </Snackbar>
        </>
    )
}

export default Home;
