import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import FormControl from "@mui/material/FormControl";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TextareaAutosize } from "@mui/material";
import logo from "../resourses/logo.png";

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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};
export const skills = [
  "CSS",
  "HTML",
  "Javascript",
  "Angular js",
  "Node js",
  "Figma",
  "Adobe premier",
  "React js",
  "Vue js",
];
export const citys = [
  "Mafraq",
  "Amman",
  "Irbid",
  "Aqaba",
  "Madaba",
  "Ajloun",
  "Jerash",
  "Ma'an",
  "Balqa",
  "Zarqa",
  "Tafilah",
  "Karak",
];
const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});
export function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Signup() {
  const [imageIsSet, setImageIsSet] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);
  const [confirmationErrorMessage, setConfirmationErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [file, setFile] = useState();
  const [fileViewr, setFileViewr] = useState(logo);
  const [percent, setPercent] = useState(0);
  const { signup, currentUser, newUserUID } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [registerType, setRegisterType] = useState("");
  const [personName, setPersonName] = useState([]);
  const [cityName, setCityName] = useState("");
  const skillTheme = useTheme();
  const handleCityChange = (event) => {
    const value = event.target.value;
    setCityName(event.target.value);
  };
  const handleSkillChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [type, setType] = useState("");
  const [avalibleTimes, setAvalibleTimes] = useState("");
  const [ngoType, setNgoType] = useState("");
  const [finishedUploading, setFinishedUploading] = useState(true);
  const handleAvalibleChange = (event) => {
    setAvalibleTimes(event.target.value);
  };
  const handleNGOTypeChange = (event) => {
    setNgoType(event.target.value);
  };
  const handleChange = (event) => {
    setType(event.target.value);
    setRegisterType(event.target.value);
  };
  async function uploadphoto() {
    if (file) {
      const storageRef = ref(
        storage,
        `/Users-Image/${document
          .getElementById("email")
          .value.toLowerCase()}/logo`
      );

      const uploadTask = await uploadBytesResumable(storageRef, file);
      await uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          setPercent(percent);
        },
        (err) => {
          console.log(err);
          setFinishedUploading(true);
        },
        () => {
          setFinishedUploading(true);
        }
      );
    }
  }
  //handleSubmit Function declartion
  async function handleSubmit(event) {
    event.preventDefault();
    setConfirmationError(false);
    setConfirmationErrorMessage("");
    setPasswordError(false);
    setPasswordErrorMessage("");
    setEmailError(false);
    setEmailErrorMessage("");

    const data = new FormData(event.currentTarget);
    if (data.get("passwordConfirmation") !== data.get("password")) {
      setConfirmationError(true);
      setConfirmationErrorMessage("Not the same password");
    } else {
      try {
        setLoading(true);
        if (registerType == "volunter") {
          await signup(data.get("email").toLowerCase(), data.get("password"), {
            type: type,
            name: data.get("name"),
            phone: data.get("phone"),
            skills: personName,
            city: cityName,
            experience: document.getElementById("jobExperience").value,
            courses: document.getElementById("volunterCourses").value,
            avalible: avalibleTimes,
            imageIsSet: imageIsSet,
          });
        } else {
          await signup(data.get("email").toLowerCase(), data.get("password"), {
            type: type,
            name: data.get("name"),
            phone: data.get("phone"),
            organizationType: ngoType,
            website: document.getElementById("website").value,
            imageIsSet: imageIsSet,
          });
        }

        await uploadphoto();
        if (finishedUploading) {
          navigate("/");
        }
      } catch (error) {
        if (error.message.includes("auth/email-already-in-use")) {
          setEmailError(true);
          setEmailErrorMessage("email alreday in use");
        } else if (
          error.message.includes(
            "Firebase: Password should be at least 6 characters"
          )
        ) {
          setPasswordError(true);
          setPasswordErrorMessage("Password should be at least 6 characters");
        } else {
          console.log("something went wrong");
        }
      }
    }

    setLoading(false);
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
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    width: "80%",
                    marginX: "auto",
                    backgroundColor: "primary.dark",
                    background: `url(${fileViewr})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      opacity: [0.9, 0.8, 0.7],
                    },
                    borderRadius: "50%",
                  }}
                  style={{ aspectRatio: 1 / 1 }}
                ></Box>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Upload image
                  <input
                    accept="image/*"
                    type="file"
                    name="image"
                    defaultValue=""
                    hidden
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setImageIsSet(true);
                        setFile(e.target.files[0]);

                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(e.target.files[0]);
                        fileReader.addEventListener("load", function () {
                          setFileViewr(this.result);
                        });
                      }
                    }}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    required
                    id="demo-simple-select"
                    value={type}
                    label="Type"
                    onChange={handleChange}
                  >
                    <MenuItem value={"volunter"}>Volunter</MenuItem>
                    <MenuItem value={"ngo"}>NGO Organization</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="phone number"
                  name="phone"
                  type="tel"
                  autoComplete="phone"
                />
              </Grid>

              {registerType === "volunter" ? (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">
                        Skills
                      </InputLabel>
                      <Select
                        labelId="multiple-skills-label"
                        id="multiple-skills"
                        multiple
                        required
                        value={personName}
                        onChange={handleSkillChange}
                        input={<OutlinedInput label="Skills" />}
                        MenuProps={MenuProps}
                      >
                        {skills.map((skill) => (
                          <MenuItem
                            key={skill}
                            value={skill}
                            style={getStyles(skill, personName, skillTheme)}
                          >
                            {skill}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextareaAutosize
                      aria-label="Job Experience"
                      placeholder="Job Experience : don't Have any job expeience"
                      id="jobExperience"
                      required
                      style={{ width: "100%", height: "100%", padding: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextareaAutosize
                      required
                      aria-label="Courses"
                      placeholder="Courses"
                      id="volunterCourses"
                      style={{ width: "100%", height: "100%", padding: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-city-label">
                        City
                      </InputLabel>
                      <Select
                        labelId="city-label"
                        required
                        id="city"
                        value={cityName}
                        MenuProps={MenuProps}
                        onChange={handleCityChange}
                        input={<OutlinedInput label="City" />}
                      >
                        {citys.map((city) => (
                          <MenuItem
                            key={city}
                            value={city}
                            style={getStyles(city, personName, skillTheme)}
                          >
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="AvalibleTimes">Avalible times</InputLabel>
                      <Select
                        labelId="AvalibleTimes-select-label"
                        required
                        id="AvalibleTimes-select"
                        value={avalibleTimes}
                        label="AvalibleTimes"
                        onChange={handleAvalibleChange}
                      >
                        <MenuItem value={"avalible"}>Avalible</MenuItem>
                        <MenuItem value={"not avalible"}>Not avalible</MenuItem>
                        <MenuItem value={"weekends"}>weekends Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : registerType === "ngo" ? (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="NGO-Type">Organization type</InputLabel>
                      <Select
                        labelId="ngo-type-select-label"
                        required
                        id="ngo-type-select"
                        value={ngoType}
                        label="AvalibleTimes"
                        onChange={handleNGOTypeChange}
                      >
                        <MenuItem value={"ngo"}>NGO</MenuItem>
                        <MenuItem value={"government"}>Government</MenuItem>
                        <MenuItem value={"religious"}>Religious</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="website"
                      label="Website Url"
                      name="website"
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={confirmationError}
                  helperText={confirmationErrorMessage}
                  name="passwordConfirmation"
                  label="Password Confirmation"
                  type="password"
                  id="passwordConfirmation"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button variant="text" component={RouterLink} to="/signin">
                  Already have an account? Sign in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
