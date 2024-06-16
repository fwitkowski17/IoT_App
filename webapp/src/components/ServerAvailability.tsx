import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {CircularProgress, Alert, AlertTitle} from '@mui/material';
import serverConfig from '../server-config.ts';

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
                    setState({ serverErrorMessage: 'Server connection error.', responseData: response.data});
                }
            } catch (error) {
                if(error.response) {
                    console.error('Error checking server connection:', error);
                    setState({ serverErrorMessage: error.response.data.errorDesc, responseData: error.response.data });
                } else if(error.request) {
                    console.error('Server is unreachable', error);
                    setState({ serverErrorMessage: "Server is unreachable", responseData: {status: "Network error", errorDesc: "Server is unreachable"} });
                }
            }
        };

        checkServerConnection();
    }, []);

    return state.serverErrorMessage
        ? <Alert severity="error">
            <AlertTitle>{state.responseData?.status}</AlertTitle>
            {state.serverErrorMessage}
        </Alert>
        : state.responseData
            ? <>{props.children}</>
            : <CircularProgress />
};

export default ServerAvailablility;