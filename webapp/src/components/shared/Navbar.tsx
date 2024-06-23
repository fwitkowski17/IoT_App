import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import {Link, useNavigate} from 'react-router-dom';
import {decodeToken, isExpired} from "react-jwt";
import serverConfig from "../../server-config.ts";
import axios from "axios";

interface NavbarItem {
    label: string;
    to: string;
}

const user_no_logged: NavbarItem[] = [
    {label: 'Login', to: '/login'},
    {label: 'Register', to: '/register'},
]

const pages: NavbarItem[] = [
    {label: 'Device summary', to: '/'},
    {label: 'Devices state', to: '/device/1'},
]

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        const token: string = localStorage.getItem('token');
        const id = decodeToken(token).userId;
        axios.delete(`${serverConfig.serverUrl}user/logout/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-auth-token': token
            }
        })
            .then((response) => {
                if(response.status == 200) {
                    localStorage.removeItem('token');
                    navigate("/login?logout=true");
                }
            })
            .catch((error: Error) => {
                console.log(error);
            })
    }

    return (
        <AppBar position="static">
            <Container maxWidth={false} sx={{backgroundColor: 'black'}}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            alignItems: 'center',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <LanguageIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        IoT Dashboard
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link to={page.to} style={{color: 'white'}}>{page.label}</Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                            {isExpired(localStorage.getItem('token')) ? user_no_logged.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link style={{color: 'white'}} to={page.to}>{page.label}</Link>
                                    </Typography>
                                </MenuItem>
                                )) : ''}
                        </Menu>
                    </Box>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Typography component={"button"}
                                key={page.label}
                                onClick={handleCloseNavMenu}
                                        sx={{my: 2, color: 'white', display: 'block', margin: '10px'}}
                            >
                                <Link style={{color: 'white'}} to={page.to}>{page.label}</Link>
                            </Typography>
                        ))}
                    </Box>
                    {isExpired(localStorage.getItem('token')) ? <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, justifyContent: 'flex-end'}}>
                        {user_no_logged.map((page) => (
                            <Typography key={page.label} variant={"button"} component={"button"} sx={{my: 2, color: 'white', display: 'block', margin: '10px'}}>
                                <Link style={{color: 'white'}} to={page.to}>{page.label}</Link>
                            </Typography>))}
                        </Box>: ''}

                    {!isExpired(localStorage.getItem('token')) && <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="Remy Sharp" src="/assets/ki.jpg"/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem key={"Account"} onClick={handleCloseNavMenu}>
                                <Typography textAlign={"center"}>
                                    <Link style={{color: 'white'}} to={'/account'}>Account</Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem key={"Logout"} onClick={handleCloseNavMenu}>
                                <Typography textAlign={"center"}>
                                    <Link onClick={handleLogout} style={{color: 'white'}}>Logout</Link>
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
