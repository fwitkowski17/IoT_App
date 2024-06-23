import React, {ChangeEvent, useEffect, useState} from "react";
import {
    Alert, AlertTitle,
    Box,
    Button,
    Container, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Snackbar,
    Stack, TextField
} from "@mui/material";
import serverConfig from "../server-config.ts";
import {UserModel} from "../models/user.model.ts"
import Loader from "./shared/Loader.tsx";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorageIcon from '@mui/icons-material/Storage';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import KeyIcon from '@mui/icons-material/Key';

interface Password {
    currentPassword: string;
    newPassword: string;
    newPassword2: string;
}

interface ErrorsPassword {
    currentPassword?: string;
    newPassword?: string;
    newPassword2?: string;
}

function Account() {
    const [userData, setUserData] = useState<UserModel | null>(null);
    const [loaderState, setLoaderState] = useState(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
    const [editPasswordVisibility, setEditPasswordVisibility] = useState(false)
    const [password, setPassword] = useState<Password>({
        currentPassword: '',
        newPassword: '',
        newPassword2: ''
    });
    const [errorsPassword, setErrorsPassword] = useState<ErrorsPassword>({});
    const [dataUpdate, setDataUpdate] = useState(false);
    const [updateError, setUpdateError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAccount()
    }, [])

    const showDeleteModal = () => setDeleteModalVisibility(true);
    const showUpdatePassword = () => setEditPasswordVisibility(true)
    const handleCloseDelModal = () => setDeleteModalVisibility(false);
    const handleClosePassword = () => setEditPasswordVisibility(false);
    const handleCloseSnack = () => setDataUpdate(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPassword((prevField) => ({
            ...prevField,
            [name]: value
        }));
    };

    const fetchAccount = () => {
        setLoaderState(true);
        fetch(`${serverConfig.serverUrl}user`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': localStorage.getItem('token')
            }})
            .then(response => response.json())
            .then((data: UserModel) => {
                setUserData(data);
                setLoaderState(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const updatePassword = () => {
        const validationErrors = validate();
        setErrorsPassword(validationErrors || {});
        if (validationErrors) return;

        axios.put(`${serverConfig.serverUrl}user/update`, {
            password: password.currentPassword,
            newPassword: password.newPassword2
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': localStorage.getItem('token')
        }})
            .then((result) => {
                if(result.status === 200) {
                    setEditPasswordVisibility(false)
                    setDataUpdate(true);
                }
            }).catch((error) => {
                setUpdateError(true);
                console.log(error)
        })
    }

    const validate = (): ErrorsPassword | null => {
        const validationErrors: ErrorsPassword = {};

        if (password.currentPassword.trim() === '') {
            validationErrors.currentPassword = 'Current password is required!';
        }
        if (password.newPassword.trim() === '') {
            validationErrors.newPassword = 'This field is required!';
        }
        if (password.newPassword2.trim() === '') {
            validationErrors.newPassword2 = 'This field is required!';
        }
        if (password.newPassword2 !== password.newPassword) {
            validationErrors.newPassword2 = 'Passwords are different!';
        }

        return Object.keys(validationErrors).length === 0 ? null : validationErrors;
    };

    const deleteAccount = () => {
        axios.delete(`${serverConfig.serverUrl}user/delete`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        }).then((response) => {
            if(response.status == 200) {
                localStorage.removeItem('token')
                navigate('/?deleted=true')
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const renderDelModal = () => {
        return (
            <>
                <DialogTitle>{userData?.name}, we are sad that we have to say goodbye to you.</DialogTitle>
                <DialogContent>
                    <Alert severity={"error"} sx={{marginBottom: "10px"}}>
                        <AlertTitle>Be sure what are you doing!</AlertTitle>
                        This action is irreversable!
                    </Alert>
                    Are you sure to delete your account?
                    <DialogActions>
                        <Button onClick={deleteAccount} size="small"><DeleteIcon /> Delete</Button>
                        <Button onClick={handleCloseDelModal} size="small">Close</Button>
                    </DialogActions>
                </DialogContent>
            </>
        )
    }

    const renderPasswordModal = () => {
        return (
            <>
                <DialogTitle>Update password</DialogTitle>
                {updateError && <Alert severity={"error"}>
                    <AlertTitle>An error has occurred</AlertTitle>
                    An error has occurred during processing your request.
                </Alert>}
                <Box mb={2}>
                    <TextField
                        label="Current Password"
                        value={password.currentPassword}
                        name="currentPassword"
                        onChange={handleChange}
                        fullWidth
                        type={"password"}
                        variant="outlined"
                        error={Boolean(errorsPassword.currentPassword)}
                        helperText={errorsPassword.currentPassword}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="New Password"
                        value={password.newPassword}
                        name="newPassword"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type={"password"}
                        error={Boolean(errorsPassword.newPassword)}
                        helperText={errorsPassword.newPassword}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="New Password again"
                        value={password.newPassword2}
                        name="newPassword2"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type={"password"}
                        error={Boolean(errorsPassword.newPassword2)}
                        helperText={errorsPassword.newPassword2}
                    />
                </Box>
                <DialogActions>
                    <Button onClick={updatePassword} size="small"><KeyIcon /> Update password</Button>
                    <Button onClick={handleClosePassword} size="small">Close</Button>
                </DialogActions>
            </>
        )
    }

    return <>
        {loaderState ? <Loader /> : <Container>
            <h2>Welcome {userData?.name}</h2>
            <div style={{ display: "flex", padding: "20px"}}>
                <Avatar alt={"user image"}
                        src={"/assets/ki.jpg"}
                        sx={{width: 200, height: 200}} />
                <Box sx={{marginLeft: "50px"}}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <PersonIcon />
                            </ListItemAvatar>
                            <ListItemText primary={"Login"} secondary={userData?.name} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <PasswordIcon />
                            </ListItemAvatar>
                            <ListItemText primary={"E-Mail address"} secondary={userData?.email} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <PasswordIcon />
                            </ListItemAvatar>
                            <ListItemText primary={"Password"} secondary="***************" />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <AdminPanelSettingsIcon/>
                            </ListItemAvatar>
                            <ListItemText primary={"Your role"} secondary={userData?.role} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <StorageIcon/>
                            </ListItemAvatar>
                            <ListItemText primary={"ID"} secondary={userData?._id} />
                        </ListItem>
                    </List>
                </Box>
            </div>
            <Stack spacing={4} direction={"row"} sx={{padding: "20px"}}>
                <Button varaint={"outlined"} color={"error"} onClick={showDeleteModal}><DeleteIcon/> Delete account</Button>
                <Button variant={"outlined"} color={"warning"} onClick={showUpdatePassword}><KeyIcon/> Update password</Button>
            </Stack>
        </Container>}
        <Dialog open={deleteModalVisibility} onClose={handleCloseDelModal} fullWidth>
            {renderDelModal()}
        </Dialog>
        <Dialog open={editPasswordVisibility} onClose={handleClosePassword} fullWidth>
            {renderPasswordModal()}
        </Dialog>
        <Snackbar open={dataUpdate} autoHideDuration={4000} onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity={"success"} variant={"filled"} sx={{width: '100%'}}>Password successfully updated!</Alert>
        </Snackbar>
    </>
}

export default Account