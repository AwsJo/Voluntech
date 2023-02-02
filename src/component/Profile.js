import React, { useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Container } from "@mui/system";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Box } from "@mui/system";
import { Grid, IconButton } from "@mui/material";
import logo from "../resourses/logo.png";
import { Button } from "@mui/material";
import { uploadBytesResumable } from "firebase/storage";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { skills } from "./Singup";
import { TextField } from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { citys } from "./Singup";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Profile = () => {
  const theme = useTheme();
  const [UserSkills, setUserSkills] = useState([]);
  const [userPhone, SetUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [organizationType, setOraganizationTyep] = useState("");
  const [website, Setwebsite] = useState("");
  const [experience, setExperience] = useState("");
  const [courses, setCourses] = useState("");
  const [city, setCity] = useState("");
  const [avaliblity, setAvalablity] = useState("");
  const [percent, setPercent] = useState(0);
  const [userT, setUser] = useState("");

  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [isImageSet, setIsImageSet] = useState(false);
  const [imageSrc, setImageSrc] = useState(logo);
  const [file, setFile] = useState();
  const [imageButtonDisabled, setImageButtonDisabled] = useState(false);
  const [skillsChanged, setSkillsChanged] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  const [NGOTypeChanged, setNGOTypeChanged] = useState(false);
  const [websiteChanged, setWebsiteChanged] = useState(false);
  const [experienceChanged, setexperienceChanged] = useState(false);
  const [coursesChanged, setCoursesChanged] = useState(false);
  const [cityChanged, setCityChanged] = useState(false);
  const [avaliblityChanged, setAvalablityChanged] = useState(false);
  async function getLogo(email) {
    getDownloadURL(ref(storage, `Users-Image/${email}/logo`))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        setIsImageSet(true);
        setImageSrc(url);
        // Or inserted into an <img> element
        // const img = document.getElementById('myimg');
        // img.setAttribute('src', url);
      })
      .catch((error) => {
        console.log("Error: " + error.message);
      });
  }
  async function uploadNewPhoto(email, file) {
    setImageButtonDisabled(true);
    const storageRef = ref(storage, `/Users-Image/${email}/logo`);
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      imageIsSet: true,
    });

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // update progress
        setPercent(percent);
      },
      (err) => {
        console.log(err);
        setImageButtonDisabled(false);
      },
      () => {
        setImageButtonDisabled(false);
      }
    );
  }
  useEffect(() => {
    async function getUserType(currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      // console.log(docSnap.data());
      setUser(
        JSON.stringify({
          type: docSnap.data().type,
          name: docSnap.data().name,
          phone: docSnap.data().phone,
          email: docSnap.data().email,
          website: docSnap.data().website,
          organizationType: docSnap.data().organizationType,
          skills: docSnap.data().skills,
          Experience: docSnap.data().experience,
          courses: docSnap.data().courses,
          avalible: docSnap.data().avalible,
          city: docSnap.data().city,
        })
      );

      if (docSnap.data().type == "volunter") {
        setUserSkills(docSnap.data().skills);
      }
      if (docSnap.data().imageIsSet) {
        await getLogo(docSnap.data().email);
      }
      setLoading(false);
    }
    getUserType(currentUser);
  }, []);
  const handleSkillsChange = (event) => {
    setSkillsChanged(true);
    const {
      target: { value },
    } = event;
    setUserSkills(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  // Uploading Name change
  async function ChangeName() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      name: userName,
    });
    setNameChanged(false);
  }
  // Update Organization Type
  async function ChangeOrganizationTyep() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      organizationType: organizationType,
    });
    setNGOTypeChanged(false);
  }
  // Update Experience
  async function ChangeExperience() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      experience: experience,
    });
    setexperienceChanged(false);
  }
  // Update Avalablity
  async function ChangeAvaliblity() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      avalible: avaliblity,
    });
    setAvalablityChanged(false);
  }
  // Udate Courses
  async function ChangeCourses() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      courses: courses,
    });
    setCoursesChanged(false);
  }
  // Uploading Phone change
  async function ChangePhone() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      phone: userPhone,
    });
    setPhoneChanged(false);
  }
  // Uploading Website Change
  async function ChangeWebsite() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      website: website,
    });
    setWebsiteChanged(false);
  }
  // Update City Name
  async function ChangeCity() {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      city: city,
    });
    setCityChanged(false);
  }
  // uploading skill change
  const ChangeSkills = async () => {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      skills: UserSkills,
    });
    setSkillsChanged(false);
  };
  return (
    <>
      <Navbar />
      <Container maxWidth="xs" sx={{ mt: 5 }}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          maxWidth="xs"
        >
          {isImageSet ? (
            <>
              <Grid item xs={12} sx={{ width: "50%", marginX: "auto" }}>
                <Box
                  sx={{
                    width: "100%",

                    marginX: "auto",
                    backgroundColor: "primary.dark",
                    background: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      opacity: [0.9, 0.8, 0.7],
                    },
                    borderRadius: "50%",
                  }}
                  style={{ aspectRatio: 1 / 1 }}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sx={{ width: "50%", marginX: "auto" }}>
                <Box
                  sx={{
                    width: "100%",

                    marginX: "auto",
                    backgroundColor: "primary.dark",
                    background: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      opacity: [0.9, 0.8, 0.7],
                    },
                    borderRadius: "50%",
                  }}
                  style={{ aspectRatio: 1 / 1 }}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              disabled={imageButtonDisabled}
            >
              {imageButtonDisabled ? `Uploading: ${percent}%` : "Change Photo"}
              <input
                accept="image/*"
                type="file"
                name="image"
                hidden
                onChange={async (e) => {
                  if (e.target.files[0]) {
                    // setImageSrc(e.target.files[0]);
                    setFile(e.target.files[0]);
                    await uploadNewPhoto(currentUser.email, e.target.files[0]);
                    // getLogo(currentUser.email);
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(e.target.files[0]);
                    fileReader.addEventListener("load", function () {
                      setImageSrc(this.result);
                    });
                  }
                }}
              />
            </Button>
          </Grid>
        </Grid>
        {!loading && (
          <>
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="center"
              alignContent="center"
              style={{ minHeight: "100vh" }}
              maxWidth="xs"
              marginY={3}
            >
              {/* Name */}
              <Grid item container direction="row" alignItems="center">
                <TextField
                  sx={{ width: "80%" }}
                  id="name"
                  label="Name"
                  name="name"
                  defaultValue={JSON.parse(userT).name}
                  onChange={(e) => {
                    setNameChanged(true);
                    setUserName(e.target.value);
                  }}
                />
                <IconButton
                  variant="contained"
                  disabled={!nameChanged}
                  color="success"
                  onClick={async () => {
                    await ChangeName();
                  }}
                >
                  <UploadIcon fontSize="small" color="inherit" />
                </IconButton>
              </Grid>
              <Grid item sx={{ width: "80%", alignSelf: "start" }}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  disabled
                  defaultValue={currentUser.email}
                />
              </Grid>
              {/* <Grid item xs={3}>
                <h3>Type: {JSON.parse(userT).type}</h3>
              </Grid> */}

              <Grid item container direction="row" alignItems="center">
                {/* Phone */}
                <TextField
                  sx={{ width: "80%" }}
                  id="phone"
                  label="phone number"
                  name="phone"
                  type="tel"
                  defaultValue={JSON.parse(userT).phone}
                  onChange={(e) => {
                    setPhoneChanged(true);
                    SetUserPhone(e.target.value);
                  }}
                />
                <IconButton
                  variant="contained"
                  disabled={!phoneChanged}
                  color="success"
                  onClick={async () => {
                    await ChangePhone();
                  }}
                >
                  <UploadIcon fontSize="small" color="inherit" />
                </IconButton>
              </Grid>

              {JSON.parse(userT).type === "ngo" ? (
                <>
                  {!JSON.parse(userT).organizationType || (
                    <Grid item container direction="row" alignItems="center">
                      <FormControl sx={{ width: "80%" }}>
                        <InputLabel id="NGO-Type">Organization type</InputLabel>
                        <Select
                          labelId="ngo-type-select-label"
                          id="ngo-type-select"
                          defaultValue={JSON.parse(userT).organizationType}
                          label="organization Type"
                          onChange={(e) => {
                            setNGOTypeChanged(true);
                            setOraganizationTyep(e.target.value);
                          }}
                        >
                          <MenuItem value={"ngo"}>NGO</MenuItem>
                          <MenuItem value={"government"}>Government</MenuItem>
                          <MenuItem value={"religious"}>Religious</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        variant="contained"
                        disabled={!NGOTypeChanged}
                        color="success"
                        onClick={async () => {
                          await ChangeOrganizationTyep();
                        }}
                      >
                        <UploadIcon fontSize="small" color="inherit" />
                      </IconButton>
                    </Grid>
                  )}
                  <Grid item container direction="row" alignItems="center">
                    {/* Phone */}
                    <TextField
                      sx={{ width: "80%" }}
                      id="website"
                      label="Website"
                      name="website"
                      defaultValue={JSON.parse(userT).website}
                      onChange={(e) => {
                        setWebsiteChanged(true);
                        Setwebsite(e.target.value);
                      }}
                    />
                    <IconButton
                      variant="contained"
                      disabled={!websiteChanged}
                      color="success"
                      onClick={async () => {
                        await ChangeWebsite();
                      }}
                    >
                      <UploadIcon fontSize="small" color="inherit" />
                    </IconButton>
                  </Grid>
                  {/* {!JSON.parse(userT).website || (
                    
                  )} */}
                </>
              ) : (
                <>
                  {/* Experience TextareaAutosize */}
                  <Grid item container direction="row" alignItems="center">
                    <TextareaAutosize
                      aria-label="Job Experience"
                      placeholder="Job Experience : don't Have any job expeience"
                      id="jobExperience"
                      onChange={(e) => {
                        setexperienceChanged(true);
                        setExperience(e.target.value);
                      }}
                      defaultValue={JSON.parse(userT).Experience}
                      style={{ width: "80%", height: "100%", padding: 10 }}
                    />
                    <IconButton
                      variant="contained"
                      disabled={!experienceChanged}
                      color="success"
                      onClick={async () => {
                        await ChangeExperience();
                      }}
                    >
                      <UploadIcon fontSize="small" color="inherit" />
                    </IconButton>
                  </Grid>
                  {/* Courses TextareaAutosize */}
                  <Grid item container direction="row" alignItems="center">
                    <TextareaAutosize
                      aria-label="Courses"
                      placeholder="Courses : don't Have any Courses"
                      id="courses"
                      onChange={(e) => {
                        setCoursesChanged(true);
                        setCourses(e.target.value);
                      }}
                      defaultValue={JSON.parse(userT).courses}
                      style={{ width: "80%", height: "100%", padding: 10 }}
                    />
                    <IconButton
                      variant="contained"
                      disabled={!coursesChanged}
                      color="success"
                      onClick={async () => {
                        await ChangeCourses();
                      }}
                    >
                      <UploadIcon fontSize="small" color="inherit" />
                    </IconButton>
                  </Grid>
                  {
                    // Skill Select
                    <Grid item container direction="row" alignItems="center">
                      <FormControl sx={{ maxWidth: "80%" }}>
                        <InputLabel id="multiple-skill-label">Skill</InputLabel>
                        <Select
                          labelId="multiple-skill-label"
                          id="multiple-skill"
                          multiple
                          value={UserSkills}
                          onChange={handleSkillsChange}
                          input={<OutlinedInput label="Skill" />}
                          MenuProps={MenuProps}
                        >
                          {skills.map((skill) => (
                            <MenuItem
                              key={skill}
                              value={skill}
                              style={getStyles(skill, UserSkills, theme)}
                            >
                              {skill}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton
                        variant="contained"
                        disabled={!skillsChanged}
                        color="success"
                        onClick={async () => {
                          await ChangeSkills();
                        }}
                      >
                        <UploadIcon fontSize="small" color="inherit" />
                      </IconButton>
                    </Grid>
                  }
                  {/* City Select */}
                  <Grid item container direction="row" alignItems="center">
                    <FormControl sx={{ width: "80%" }}>
                      <InputLabel id="demo-multiple-city-label">
                        City
                      </InputLabel>
                      <Select
                        labelId="city-label"
                        id="city"
                        defaultValue={JSON.parse(userT).city}
                        MenuProps={MenuProps}
                        onChange={(e) => {
                          setCityChanged(true);
                          setCity(e.target.value);
                        }}
                        input={<OutlinedInput label="City" />}
                      >
                        {citys.map((city) => (
                          <MenuItem
                            key={city}
                            value={city}
                            style={getStyles(city, city, theme)}
                          >
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      variant="contained"
                      disabled={!cityChanged}
                      color="success"
                      onClick={async () => {
                        await ChangeCity();
                      }}
                    >
                      <UploadIcon fontSize="small" color="inherit" />
                    </IconButton>
                  </Grid>
                  <Grid item container direction="row" alignItems="center">
                    <FormControl sx={{ width: "80%" }}>
                      <InputLabel id="AvalibleTimes">Avalible times</InputLabel>
                      <Select
                        labelId="AvalibleTimes-select-label"
                        required
                        id="AvalibleTimes-select"
                        defaultValue={JSON.parse(userT).avalible}
                        label="AvalibleTimes"
                        onChange={(e) => {
                          setAvalablityChanged(true);
                          setAvalablity(e.target.value);
                        }}
                      >
                        <MenuItem value={"avalible"}>Avalible</MenuItem>
                        <MenuItem value={"not avalible"}>Not avalible</MenuItem>
                        <MenuItem value={"weekends"}>weekends Only</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      variant="contained"
                      disabled={!avaliblityChanged}
                      color="success"
                      onClick={async () => {
                        await ChangeAvaliblity();
                      }}
                    >
                      <UploadIcon fontSize="small" color="inherit" />
                    </IconButton>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};
export default Profile;
