import React, { Component, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import {Link} from "react-router-dom";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import serverConfig from "../server-config.ts";
import {sortElemsByDeviceId} from "../utils/helper.ts";
import axios from "axios";

interface Account {
    username: string;
    password: string;
}

interface Errors {
    username?: string;
    password?: string;
}

interface State {
    account: Account;
    errors: Errors;
}

class LoginForm extends Component<{}, State> {
    state: State = {
        account: {
            username: "",
            password: ""
        },
        errors: {}
    };

    checkServerAvailability = async (): Promise<boolean> => {
        try {
            const response = await axios.get(`${serverConfig.serverUrl}health`);
            return response.status === 200;
        } catch (error) {
            console.error('Error checking server connection:', error);
            return false;
        }
    }

    validate = (): Errors | null => {
        const errors: Errors = {};

        const { account } = this.state;
        if (account.username.trim() === '') {
            errors.username = 'Username is required!';
        }
        if (account.password.trim() === '') {
            errors.password = 'Password is required!';
        }

        return Object.keys(errors).length === 0 ? null : errors;
    };

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;
        const {account} = this.state
        const bodyParams = new URLSearchParams({
            "login": account.username,
            "password": account.password
        })

        fetch(`${serverConfig.serverUrl}auth`)
            .then(response => response.json())
            .then(data => {
                setData(sortElemsByDeviceId(data));
                setLoaderState(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const account = { ...this.state.account };
        account[event.currentTarget.name] = event.currentTarget.value;
        this.setState({ account });
    };

    render() {
        return (
            <Container maxWidth="sm" style={{"padding": "30px"}}>
                <Typography variant="h4" component="h1" gutterBottom noWrap sx={{
                        mr: 2,
                        display: {xs: 'none', md: 'flex'},
                        alignItems: 'center'}}>
                    <PersonIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}} /> Login
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <TextField
                            label="Username"
                            value={this.state.account.username}
                            name="username"
                            onChange={this.handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        {this.state.errors.username && (
                            <Alert severity="error">
                                {this.state.errors.username}
                            </Alert>
                        )}
                    </div>
                    <div className="form-group">
                        <TextField
                            label="Password"
                            value={this.state.account.password}
                            name="password"
                            onChange={this.handleChange}
                            type="password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        {this.state.errors.password && (
                            <Alert severity="error">
                                {this.state.errors.password}
                            </Alert>
                        )}
                    </div>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                    <Typography variant={"h7"} component={"p"} noWrap sx={{mr: 2, display: {xs: 'none', md: 'flex'}, alignItems: 'center'}} marginTop={"10px"}>
                        <PersonAddIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/> No account? Create it <Link to={"/register"}>here</Link>.
                    </Typography>
                </form>
            </Container>
        );
    }
}

export default LoginForm;