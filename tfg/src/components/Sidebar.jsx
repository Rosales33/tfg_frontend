import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../api';

const Sidebar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await getUserInfo();
        setRole(response.data.role);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    if (isLoggedIn) {
      fetchRole();
    } else {
      setRole(null);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login-signup');
  };

  const isAdmin = role === 'ROLE_ADMIN';
  const isUser = role === 'ROLE_USER';

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        backgroundColor: '#1e2a38',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{ color: '#ffffff', fontWeight: 'bold', mb: 3 }}
        >
          Menu
        </Typography>
        <List>
          {(!isLoggedIn || isUser) && (
            <>
              <ListItem
                button
                component={Link}
                to="/symptom-checker"
                sx={{
                  '&:hover': { backgroundColor: '#2f3d4d' },
                  borderRadius: 1
                }}
              >
                <ListItemText
                  primary="Symptoms Checker"
                  primaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/search-info"
                sx={{
                  '&:hover': { backgroundColor: '#2f3d4d' },
                  borderRadius: 1
                }}
              >
                <ListItemText
                  primary="Search Info"
                  primaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
                />
              </ListItem>
            </>
          )}

          {isAdmin && (
            <>
              <ListItem
                button
                component={Link}
                to="/admin/diseases"
                sx={{
                  '&:hover': { backgroundColor: '#2f3d4d' },
                  borderRadius: 1
                }}
              >
                <ListItemText
                  primary="Diseases"
                  primaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/admin/symptoms"
                sx={{
                  '&:hover': { backgroundColor: '#2f3d4d' },
                  borderRadius: 1
                }}
              >
                <ListItemText
                  primary="Symptoms"
                  primaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/admin/precautions"
                sx={{
                  '&:hover': { backgroundColor: '#2f3d4d' },
                  borderRadius: 1
                }}
              >
                <ListItemText
                  primary="Precautions"
                  primaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
                />
              </ListItem>
            </>
          )}

          {isUser && (
            <ListItem
              button
              component={Link}
              to="/previous-diagnoses"
              sx={{
                '&:hover': { backgroundColor: '#2f3d4d' },
                borderRadius: 1
              }}
            >
              <ListItemText
                primary="See Previous Diagnoses"
                primaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
              />
            </ListItem>
          )}
        </List>

        <Divider sx={{ backgroundColor: '#455a64', my: 2 }} />

        {!isLoggedIn ? (
          <ListItem
            button
            component={Link}
            to="/login-signup"
            sx={{
              '&:hover': { backgroundColor: '#2f3d4d' },
              borderRadius: 1
            }}
          >
            <ListItemText
              primary="Sign Up / Log In"
              primaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
            />
          </ListItem>
        ) : (
          <Button
            variant="outlined"
            onClick={handleLogout}
            fullWidth
            sx={{
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#2f3d4d',
                borderColor: '#ffffff'
              }
            }}
          >
            Log Out
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;




