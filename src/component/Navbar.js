import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { ButtonGroup } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { List } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Drawer } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      darker: "#053e85",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});
export default function Navbar() {
  const MediaTheme = useTheme();
  const matches = useMediaQuery(MediaTheme.breakpoints.down("sm"));
  const [showList, setShowList] = React.useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  async function handleSignout() {
    try {
      logout();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    async function UserInfoByUID() {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      setUserType(docSnap.data().type);
      setLoading(false);
    }
    if (currentUser) {
      UserInfoByUID();
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");
  return (
    <>
      <CssBaseline />

      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <ThemeProvider theme={theme}>
              <Button
                variant="text"
                component={RouterLink}
                to="/"
                sx={{ fontSize: 20 }}
              >
                Voluntech
              </Button>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
                onClick={() => {
                  setShowList(!showList);
                }}
              >
                <MenuIcon />
              </IconButton>

              {/* Navigation Button Group */}
              {currentUser ? (
                // Nav Buttons if user Loged in
                <>
                  <ButtonGroup
                    variant="outlined"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    {window.location.pathname === "/profile" ? (
                      <></>
                    ) : (
                      <span>
                        <Button
                          variant="outlined"
                          component={RouterLink}
                          to="/profile"
                          sx={{
                            mr: 2,
                          }}
                        >
                          profile
                        </Button>
                      </span>
                    )}
                    <span>
                      <Button
                        variant="outlined"
                        onClick={handleSignout}
                        sx={{ mr: 2 }}
                      >
                        Sign Out
                      </Button>
                    </span>
                    {!loading ? (
                      userType === "ngo" ? (
                        <>
                          {window.location.pathname === "/addevent" || (
                            <span>
                              <Button
                                variant="outlined"
                                component={RouterLink}
                                to="/addevent"
                                sx={{ mr: 2 }}
                              >
                                Add Event
                              </Button>
                            </span>
                          )}
                          {window.location.pathname === "/users" || (
                            <span>
                              <Button
                                variant="outlined"
                                component={RouterLink}
                                to="/users"
                              >
                                Users
                              </Button>
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {" "}
                          {window.location.pathname === "/events" || (
                            <span>
                              <Button
                                variant="outlined"
                                component={RouterLink}
                                to="/events"
                                sx={{ mr: 2 }}
                              >
                                Events
                              </Button>
                            </span>
                          )}
                        </>
                      )
                    ) : (
                      <></>
                    )}
                  </ButtonGroup>
                </>
              ) : (
                // Nav Buttons if user not Loged in
                <>
                  <ButtonGroup
                    variant="outlined"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    <span>
                      <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/signin"
                        sx={{ mr: 2 }}
                      >
                        Sign in
                      </Button>
                    </span>
                    <span>
                      <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/signup"
                      >
                        Sign Up
                      </Button>
                    </span>
                  </ButtonGroup>
                </>
              )}
            </ThemeProvider>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Drawer Declaration */}
      {currentUser ? (
        // Drawer If user Loged in
        <>
          <Drawer
            open={showList}
            onClose={() => {
              setShowList(false);
            }}
          >
            <List sx={{ display: { xs: "block", sm: "none" } }}>
              {window.location.pathname === "/profile" ? (
                <> </>
              ) : (
                <>
                  <ListItem>
                    <ListItemButton component={RouterLink} to="/profile">
                      <ListItemText>Profile</ListItemText>
                    </ListItemButton>
                  </ListItem>
                </>
              )}

              <ListItem>
                <ListItemButton onClick={handleSignout}>
                  <ListItemText>Sign Out</ListItemText>
                </ListItemButton>
              </ListItem>
              {!loading ? (
                userType === "ngo" ? (
                  <>
                    {window.location.pathname === "/addevent" || (
                      <ListItem>
                        <ListItemButton component={RouterLink} to="/addevent">
                          <ListItemText>Add Event</ListItemText>
                        </ListItemButton>
                      </ListItem>
                    )}
                    {window.location.pathname === "/users" || (
                      <ListItem>
                        <ListItemButton component={RouterLink} to="/users">
                          <ListItemText>Users</ListItemText>
                        </ListItemButton>
                      </ListItem>
                    )}
                  </>
                ) : (
                  <>
                    {window.location.pathname === "/events" || (
                      <ListItem>
                        <ListItemButton component={RouterLink} to="/events">
                          <ListItemText>Events</ListItemText>
                        </ListItemButton>
                      </ListItem>
                    )}
                  </>
                )
              ) : (
                <></>
              )}
            </List>
          </Drawer>
        </>
      ) : (
        // Drawer if user Not loged in
        <>
          <Drawer
            open={showList}
            onClose={() => {
              setShowList(false);
            }}
          >
            <List sx={{ display: { xs: "block", sm: "none" } }}>
              <ListItem>
                <ListItemButton component={RouterLink} to="/signin">
                  <ListItemText>Sign in</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component={RouterLink} to="/signup">
                  <ListItemText>Sign up</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        </>
      )}
    </>
  );
}
