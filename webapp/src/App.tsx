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
                <Routes>
                    <Route path="/" element={isExpired(localStorage.getItem('token')) ? <Navigate replace to={"/login"}/> : <Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<SignUpForm />}/>
                    <Route path="/device/:id" element={isExpired(localStorage.getItem('token')) ? <Navigate replace to={"/login"}/> : <Dashboard/> } />
                </Routes>
            </ThemeProvider>
        </Router>
    )
}

export default App
