import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      Voluntech {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default function Signin() {
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPasswordError(false);
    setPasswordErrorMessage("");
    setEmailError(false);
    setEmailErrorMessage("");
    try {
      setLoading(true);
      await login(data.get("email"), data.get("password"));
      navigate("/profile");
    } catch (error) {
      if (error.message.includes("(auth/wrong-password)")) {
        setPasswordError(true);
        setPasswordErrorMessage("wrong password");
      } else if (error.message.includes("(auth/user-not-found)")) {
        setEmailError(true);
        setEmailErrorMessage("Email not found");
      } else {
        console.log("something went Wrong");
      }
    }
    setLoading(false);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={emailError}
              helperText={emailErrorMessage}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button variant="text" component={RouterLink} to="/signup">
                  Don't have an account? Sign Up
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
