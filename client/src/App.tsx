import './App.css';
import { Sidebar } from "./Sidebar";
import Box from '@mui/material/Box';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { MainContent } from "./MainContent";
import { CustomAppBar } from "./CustomAppBar";
import { AuthProvider } from "./auth/AuthProvider";
import { SignUp } from "./auth/SignUp";
import { BettingEventsDashboard } from "@betting/BettingEventsDashboard";
import { Account } from './user/Account';
import { AuthedComponent } from './auth/AuthedComponent';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />}>
              <Route path="leagues">
                <Route path=":leagueId/events" element={<BettingEventsDashboard />}>
                </Route>
              </Route>
            </Route>
            <Route path="/account" element={<AuthedComponent><Account /></AuthedComponent>} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

const AppLayout = () => {
  return (
    <>
      <CustomAppBar />
      <Outlet />
    </>
  )
}

const Home = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 1, pt: 0 }}>
        <MainContent>
          <Outlet />
        </MainContent>
      </Box>
    </Box>
  )
}

export default App;
