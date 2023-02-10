import { Button, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useContext, useRef, useState } from "react";
import { AuthContext } from "./auth/AuthProvider";
import { manageErrors } from "./utils/DataFetcher";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';

export const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export const CustomAppBar = () => {
  const { isAuthenticated, setAuthRequest, setIsAuthenticated } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleLogout = () => {
    setAnchorEl(null);
    fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => manageErrors(response))
      .then(() => setIsAuthenticated(false))
      .then(() => navigate("/"));
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>
              KWSports
            </Link>
          </Typography>
          {isAuthenticated && <Button color="inherit">My Bets</Button>}
          {isAuthenticated &&
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={openMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={anchorEl != null}
                onClose={handleClose}
              >
                <Link to="/account" state={{ previousRoute: location.pathname }} style={{ color: 'inherit', textDecoration: 'inherit' }}><MenuItem onClick={handleClose}>Account</MenuItem></Link>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>}
          {!isAuthenticated &&
            <Button onClick={() => setAuthRequest({ isAuthRequested: true, previousRoute: location.pathname })} color="inherit">Login</Button>}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
}