import React, { Component, ChangeEvent, FormEvent } from "react";
import {TextField, Button, Container, Typography, Alert, AlertTitle} from '@mui/material';
import {Link, Navigate} from "react-router-dom";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import serverConfig from "../server-config.ts";
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
    success: boolean;
    logout: boolean;
    showInfo: boolean;
    loginError: boolean;
    loginSuccess: boolean;
}

class LoginForm extends Component<{}, State> {
    state: State = {
        account: {
            username: "",
            password: ""
        },
        errors: {},
        success: false,
        logout: false,
        showInfo: false,
        loginError: false,
        loginSuccess: false
    };

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search)
        const success = urlParams.get('success') === "true"
        const logout = urlParams.get('logout') === "true"
        const showInfo = urlParams.get('showInfo') === "true"
        this.setState({success, logout, showInfo})
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

        axios.post(`${serverConfig.serverUrl}user/auth`, {
            login: account.username,
            password: account.password
        }).then(response => {
            if(response.status == 200) {
                localStorage.setItem("token", response.data.token)
                this.setState({loginSuccess: true})
            }
        }).catch(error => {
            if(error.response.status == 401) {
                this.setState({loginError: true})
            }
            console.error('Error logging in!', error)
        })
    };

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const account = { ...this.state.account };
        account[event.currentTarget.name] = event.currentTarget.value;
        this.setState({ account });
    };

    render() {
        return (<>
            {this.state.loginSuccess && (<Navigate replace to={"/"} />)}
            <Container maxWidth="sm" style={{"padding": "30px"}}>
                {this.state.success && (<Alert severity={"success"} sx={{"margin-bottom": "20px"}}>
                    <AlertTitle>Account successfully created!</AlertTitle>
                    Now you can login with provided details.
                </Alert>)}
                {this.state.loginError && (<Alert severity={"error"} sx={{"margin-bottom": "20px"}}>
                    <AlertTitle>Incorrect login details!</AlertTitle>
                    Incorrect provided login or password.
                </Alert>)}
                {this.state.logout && (<Alert severity={"info"} sx={{"margin-bottom": "20px"}}>
                    <AlertTitle>Log out</AlertTitle>
                    User successfully logged out.
                </Alert>)}
                {this.state.showInfo && (<Alert severity={"warning"} sx={{"margin-bottom": "20px"}}>
                    <AlertTitle>No permissions for this feature</AlertTitle>
                    To access detailed data, you need to log in.
                </Alert> )}
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
            </>
        );
    }
}

export default LoginForm;