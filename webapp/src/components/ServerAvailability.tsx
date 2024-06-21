import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Alert, AlertTitle, Container} from '@mui/material';
import serverConfig from '../server-config.ts';
import Loader from "./shared/Loader.tsx";

interface State {
    responseData?: {
        status: string | null;
        errorDesc?: string | null;
        uptime?: string | null;
    }
    serverErrorMessage?: string;
}

const ServerAvailablility: React.FC = (props) => {
    const [state, setState] = useState<State>({
        serverErrorMessage: undefined,
    });

    useEffect(() => {
        const checkServerConnection = async () => {
            try {
                const response = await axios.get(`${serverConfig.serverUrl}health`);
                if (response.status === 200) {
                    setState({ responseData: response.data});
                } else {
                    setState({ serverErrorMessage: 'Error', responseData: response.data});
                }
            } catch (error) {
                if(error.response) {
                    console.error('Error checking server connection:', error);
                    setState({ serverErrorMessage: error.response.data.errorDesc, responseData: error.response.data });
                } else if(error.request) {
                    console.error('Server is unreachable', error);
                    setState({ serverErrorMessage: "Error", responseData: {status: "Network error", errorDesc: "Server is unreachable. Please try again later."} });
                }
            }
        };

        checkServerConnection();
    }, []);

    return <>
            {state.serverErrorMessage
                ? <Container maxWidth={"md"} sx={{padding: "30px"}}>
                    <Alert severity="error">
                    <AlertTitle>{state.responseData?.status}</AlertTitle>
                    {state.responseData?.errorDesc}
                    </Alert>
                    </Container>
                : state.responseData
                    ? <>{props.children}</>
                    : <Loader/>}
        </>
};

export default ServerAvailablility;