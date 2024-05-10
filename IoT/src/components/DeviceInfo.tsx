import { Typography, Container } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'

function DeviceInfo() {
    return (
        <Container maxWidth={"xs"} sx={{backgroundColor: 'gray'}}>

        <Typography variant="h5" component="div">Device no. 3</Typography>
        <hr />
        <Typography style={{paddingTop: '10px'}} component="div" width={200} textAlign={'left'}>
            <Typography variant="h6" component="div">
       <DeviceThermostatIcon></DeviceThermostatIcon>
       <span className="value">26.7</span> <span>&deg;C</span>
   </Typography>
   <Typography variant="h6" component="div">
       <CloudUploadIcon></CloudUploadIcon>
       <span className="value">1025</span> hPa
   </Typography>
   <Typography variant="h6" component="div">
       <OpacityIcon></OpacityIcon>
       <span className="value">45</span>%
       </Typography>
</Typography>
</Container>
    )
}

export default DeviceInfo