import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Link} from 'react-router-dom';
import {EntryModel} from "../../models/entry.model.ts";
import React, {useState} from "react";
import {
    Alert,
    AlertTitle,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    InputLabel, Select, SelectChangeEvent
} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import MenuItem from "@mui/material/MenuItem";
import serverConfig from "../../server-config.ts";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

interface TileProps {
    data: EntryModel | null;
    id?: string | number,
    hasData?: boolean,
    details?: boolean,
    active?: boolean,
    showDelete?: boolean,
    soDiff?: boolean
}

function Tile({id, hasData, data, active = false, details = true, showDelete = false, soDiff = false}: TileProps) {

    const [open, setOpen] = useState(false);
    const [removeRange, setRemoveRange] = useState<string | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChange = (event: SelectChangeEvent) => {
        setRemoveRange(event.target.value as string);
    }

    const renderDialogContext = () => {
        return (
            <>
                <Alert severity={"warning"} sx={{marginBottom: "20px"}}>
                    <AlertTitle>Be aware!</AlertTitle>
                    This action is irreversable!
                </Alert>
                <DialogContentText>
                    Select the time range from which the data will be deleted:
                    <FormControl sx={{marginY: "20px"}} fullWidth>
                        <InputLabel id={"time-label"}>Time</InputLabel>
                        <Select
                            labelId={"time-label"}
                            value={removeRange}
                            label={"Time"}
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>1 hour</MenuItem>
                            <MenuItem value={20}>1 day (24 hours)</MenuItem>
                            <MenuItem value={30}>1 week</MenuItem>
                            <MenuItem value={99}>Whole data</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContentText>
            </>
        )
    }

    const removeData = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsError(false)
        if(removeRange == null) {
            setIsError(true)
            return
        }
        const id = (e.target as HTMLButtonElement).id
        axios.delete(`${serverConfig.serverUrl}data/${id}/${removeRange}`, {
            headers: {
            'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': localStorage.getItem('token')
        }})
            .then((response) => {
                if(response.status == 200) {
                    setOpen(false)
                    window.location.replace(`/device/${id}?delete=true`)
                }
            })
    }

    return (
        <>
        <Card className={`tile-device-inside ${active ? 'active' : ''} ${soDiff ? 'tile-device-hugediffer' : ''}`} sx={{minWidth: 275}}>
            <CardContent style={{minHeight: '200px'}}>
                <Typography style={{borderBottom: '5px solid #fff', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between'}} variant="h5"
                            component="div">
                    Device No. {id}
                    {soDiff && <Tooltip title={"Difference between two last readings is over 20%"}>
                        <WarningIcon />
                    </Tooltip>}
                </Typography>
                {!hasData && <Typography variant="h6"
                                         component="div">
                    No data
                </Typography>}
                {hasData && <Typography style={{paddingTop: '10px'}} component="div">
                    <Typography variant="h6" component="div">
                        <DeviceThermostatIcon></DeviceThermostatIcon>
                        <span className="value">{data?.temperature}</span> <span>&deg;C</span>
                    </Typography>
                    <Typography variant="h6" component="div">
                        <CloudUploadIcon></CloudUploadIcon>
                        <span className="value">{data?.pressure}</span> hPa
                    </Typography>
                    <Typography variant="h6" component="div">
                        <OpacityIcon></OpacityIcon>
                        <span className="value">{data?.humidity}</span>%
                    </Typography>
                </Typography>}
            </CardContent>
            {details && <CardActions>
                <Button size="small" component={Link} to={`/device/${id}`}>Details</Button>
                {showDelete && hasData && <Button size="small" onClick={handleClickOpen}>Delete data</Button> }
            </CardActions>}
        </Card>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete data from device no. {id}</DialogTitle>
            <DialogContent>
                {renderDialogContext()}
            </DialogContent>
            {isError && <Alert severity={"error"}>Please specify time range!</Alert> }
            <DialogActions>
                <Button onClick={removeData} size="small" id={id}>Remove</Button>
                <Button onClick={handleClose} size="small">Close</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}

export default Tile;
