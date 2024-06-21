import React from "react";
import {Container, Typography} from "@mui/material";

function Footer() {
    return <>
        <Container sx={{backgroundColor: 'black'}} style={{"padding": "20px"}}>
            <Typography align={"center"} component={"h6"} variant={"h6"}>
                &copy; 2024 Copyright by Filip Witkowski
            </Typography>
        </Container>
    </>
}

export default Footer;