import './App.css'
import Navbar from "./components/shared/Navbar";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from "./components/Dashboard";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from "./components/Home";
import {isExpired} from "react-jwt";
import Login from "./components/Login.tsx";
import SignUpForm from "./components/SignUpForm.tsx";
import ServerAvailability from "./components/ServerAvailability.tsx";
import Footer from "./components/shared/Footer.tsx"

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {

    return (
        <Router>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <Navbar></Navbar>
                <ServerAvailability>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<SignUpForm />}/>
                        <Route path="/device/:id" element={isExpired(localStorage.getItem('token')) ? <Navigate replace to={"/login?showInfo=true"}/> : <Dashboard/> } />
                    </Routes>
                </ServerAvailability>
                <Footer></Footer>
            </ThemeProvider>
        </Router>
    )
}

export default App
