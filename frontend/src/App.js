import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import PlaceList from './components/Places/PlaceList';
import PlaceDetails from './components/Places/PlaceDetails';
import DeviceGroups from './components/Devices/DeviceGroups';
import DeviceInstances from './components/Devices/DeviceInstances';
import EventList from './components/Events/EventList';
import ScriptList from './components/Scripts/ScriptList';
import ScriptDetails from './components/Scripts/ScriptDetails';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="places" element={<PlaceList />} />
              <Route path="places/:placeId" element={<PlaceDetails />} />
              <Route path="places/:placeId/groups" element={<DeviceGroups />} />
              <Route path="groups/:groupId/devices" element={<DeviceInstances />} />
              <Route path="events" element={<EventList />} />
              <Route path="scripts" element={<ScriptList />} />
              <Route path="scripts/new" element={<ScriptDetails />} />
              <Route path="scripts/:scriptId" element={<ScriptDetails />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;