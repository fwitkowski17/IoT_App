import React from "react";
import {Box, Typography} from "@mui/material";

function Footer() {
    return <>
        <Box sx={{backgroundColor: 'black', width: "100%", padding: '15px'}}>
            <Typography textAlign={"center"} component={"p"} variant={"p"}>
                &copy; 2024 Copyright by Filip Witkowski
            </Typography>
        </Box>
    </>
}

export default Footer;