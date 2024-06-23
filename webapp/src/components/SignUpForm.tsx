import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Typography,
    Alert,
    Box,
    FormGroup,
    FormControlLabel,
    Checkbox,
    AlertTitle
} from '@mui/material';
import serverConfig from "../server-config.ts";

interface Account {
    username: string;
    email: string;
    password: string;
    password2: string;
    isAccepted: boolean;
}

interface Errors {
    username?: string;
    email?: string;
    password?: string;
    password2?: string;
    isAccepted?: string;
}

const SignUpForm: React.FC = () => {
    const [account, setAccount] = useState<Account>({
        username: '',
        email: '',
        password: '',
        password2: '',
        isAccepted: false
    });
    const [errors, setErrors] = useState<Errors>({});

    const [registerationError, setRegisterationError] = useState(false);

    const navigate = useNavigate();

    const validate = (): Errors | null => {
        const validationErrors: Errors = {};

        if (account.username.trim() === '') {
            validationErrors.username = 'Username is required!';
        }
        if (account.email.trim() === '') {
            validationErrors.email = 'Email is required!';
        }
        if (account.password.trim() === '') {
            validationErrors.password = 'Password is required!';
        }
        if(account.password2.trim() === '') {
            validationErrors.password2 = 'Password is required!';
        } else if(account.password != account.password2) {
            validationErrors.password2 = 'Passwords are not the same!';
        }
        if (!account.isAccepted) {
            validationErrors.isAccepted = 'You must accept Terms of Service!';
        }

        return Object.keys(validationErrors).length === 0 ? null : validationErrors;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        axios.post(`${serverConfig.serverUrl}user/create`, {
                name: account.username,
                email: account.email,
                password: account.password
            })
            .then((response) => {
                if(response.status == 200) {
                    navigate('/login?register=true');
                }
            })
            .catch((error) => {
                setRegisterationError(true)
                console.log(error);
            });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value
        }));
    };

    const handleAcceptation = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setAccount((prevAccount) => ({
            ...prevAccount,
            isAccepted: checked
        }));
    }

    return (
        <Container maxWidth="md" style={{"padding": "20px"}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Login"
                        value={account.username}
                        name="username"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Email"
                        value={account.email}
                        name="email"
                        onChange={handleChange}
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        value={account.password}
                        name="password"
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password again"
                        value={account.password2}
                        name="password2"
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password2)}
                        helperText={errors.password2}
                    />
                </Box>
                <Box mb={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            label={"I accept Terms of Service"}
                            value={account.isAccepted}
                            onChange={handleAcceptation}
                        />
                    </FormGroup>
                    {errors.isAccepted ? <Typography className={"MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-xzkq1u-MuiFormHelperText-root"}>{errors.isAccepted}</Typography> : <Typography />}
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign Up
                </Button>
                {Object.values(errors).some((error) => error) && (
                    <Box mt={2}>
                        {Object.values(errors).map((error, index) => (
                            error && (
                                <Alert severity="error" key={index}>
                                    {error}
                                </Alert>
                            )
                        ))}
                    </Box>
                )}
            </form>
            {registerationError && (
                <Box mt={2}>
                    <Alert severity="error">
                        <AlertTitle>An error has occurred during registration!</AlertTitle>
                        Probably this login or e-mail address is used by another user. Please try use another e-mail address and/or login.
                    </Alert>
                </Box>
            )}
        </Container>
    );
};

export default SignUpForm;
