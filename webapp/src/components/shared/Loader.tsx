
import CircularProgress from '@mui/material/CircularProgress';
import {Typography} from "@mui/material";

function Loader() {
    return (
        <Typography align={"center"} sx={{padding: "30px"}}>
            <CircularProgress />
        </Typography>
    );
}

export default Loader;
