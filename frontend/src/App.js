import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Layout from "./components/layout/Layout";
import Sidebar from "./components/layout/Sidebar";
import UserList from "./components/users/UserList";
import UserForm from "./components/users/UserForm";
import NotFound from "./components/pages/NotFound";
import UserHeader from "./components/users/UserHeader";
import FileList from "./components/files/FileList";
import TripsList from "./components/trips/TripsList";
import TripForm from "./components/trips/TripForm";
import TripDetails from "./components/trips/TripDetails";
import PaymentsList from "./components/payments/PaymentsList";
import PaymentForm from "./components/payments/PaymentForm";
import PaymentDetails from "./components/payments/PaymentDetails";
import PresenceHistory from "./components/presence/PresenceHistory";
import Reports from "./components/reports/Reports";
import Notification from "./components/base/Notification";
import { NotificationProvider, useNotification } from "./context/NotificationContext";
import { registerNotification } from "./services/axiosInstance";
import Button from "./components/base/Button";
import theme from './styles/theme';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        sessionStorage.getItem("token") !== null
    );
    const location = useLocation();
    const { message, clearNotification, showNotification } = useNotification();

    useEffect(() => {
        registerNotification(showNotification);
    }, [showNotification]);

    useEffect(() => {
        setIsAuthenticated(sessionStorage.getItem("token") !== null);
    }, [location]);

    const updateAuthStatus = (status) => setIsAuthenticated(status);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout sidebar={isAuthenticated ? <Sidebar updateAuthStatus={updateAuthStatus} /> : null}>
                {isAuthenticated && <UserHeader user={{
                    fullName: sessionStorage.getItem("fullName"),
                    role: sessionStorage.getItem("role"),
                    photo: sessionStorage.getItem("photo"),
                }} />}
                <main style={{ width: "100%" }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/login" element={
                            isAuthenticated
                                ? <Navigate to="/home" replace />
                                : <Login updateAuthStatus={updateAuthStatus} />
                        } />
                        <Route path="/home" element={
                            isAuthenticated
                                ? <Home />
                                : <Navigate to="/login" replace />
                        } />
                        <Route path="/users" element={
                            isAuthenticated
                                ? <UserList />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/users/new" element={
                            isAuthenticated
                                ? <UserForm />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/users/edit/:id" element={
                            isAuthenticated
                                ? <UserForm />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/trips" element={
                            isAuthenticated
                                ? <TripsList />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/trips/new" element={
                            isAuthenticated
                                ? <TripForm />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/trips/:id" element={
                            isAuthenticated
                                ? <TripDetails />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/payments" element={
                            isAuthenticated
                                ? <PaymentsList />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/payments/new" element={
                            isAuthenticated
                                ? <PaymentForm />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/payments/:id" element={
                            isAuthenticated
                                ? <PaymentDetails />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/presence" element={
                            isAuthenticated
                                ? <PresenceHistory />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/reports" element={
                            isAuthenticated
                                ? <Reports />
                                : <Navigate to="/login" />
                        } />
                        <Route path="/files" element={
                            isAuthenticated
                                ? <FileList />
                                : <Navigate to="/login" />
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                {message && (
                    <Notification>
                        {message}
                        <Button onClick={clearNotification} style={{ marginLeft: 16 }}>X</Button>
                    </Notification>
                )}
            </Layout>
        </ThemeProvider>
    );
}

export default function AppWrapper() {
    return (
        <NotificationProvider>
            <Router>
                <App />
            </Router>
        </NotificationProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);