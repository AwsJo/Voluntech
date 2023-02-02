import React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Stack, ThemeProvider } from "@mui/system";
import { Container } from "@mui/system";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import Navbar from "./Navbar";
import { TextField } from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { skills } from "./Singup";
import { TextareaAutosize } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useAuth } from "../context/AuthContext";
import Activity from "./Activity";
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
// function getStyles(name, personName, theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

const AddAcitivity = () => {
  const [userName, setUserName] = useState("");
  const theme = useTheme();
  const [activitys, setAvtiviys] = useState({});
  const { currentUser } = useAuth();
  const [personName, setPersonName] = React.useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function UserInfoByUID() {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      const q = query(
        collection(db, "activity"),
        where("creatorId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      let tempAct = {};
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        tempAct[doc.id] = doc.data();
      });
      setAvtiviys(tempAct);

      setUserName(docSnap.data().name);
      setLoading(false);
    }
    UserInfoByUID();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "activity"), {
        name: document.getElementById("activity-name").value,
        describtion: document.getElementById("activity-description").value,
        startingDate: document.getElementById("starting-date").value,
        endingDate: document.getElementById("ending-date").value,
        volunterNumber: document.getElementById("volunter-number").value,
        skills: personName,
        creatorId: currentUser.uid,
        acceptedVolunters: [],
        voluntersRequest: [],
        open: true,
        creatorName: userName,
      });
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
    document.getElementById("activity-name").value = "";
    document.getElementById("activity-description").value = "";
    document.getElementById("starting-date").value = "";
    document.getElementById("ending-date").value = "";
    document.getElementById("volunter-number").value = "";
    setPersonName([]);
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="activity-name"
                label="Activity Name"
                name="activity-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                required
                aria-label="Activity Description"
                placeholder="Activity Description"
                id="activity-description"
                style={{ width: "100%", height: "100%", padding: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                id="starting-date"
                label="Starting Date"
                name="starting-date"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                id="ending-date"
                label="Ending Date"
                name="ending-date"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="number"
                id="volunter-number"
                label="Number of volunters"
                name="volunter-number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="multiple-skill-label">Skill</InputLabel>
                <Select
                  labelId="multiple-skill-label"
                  id="multiple-skill"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Skills" />}
                  MenuProps={MenuProps}
                >
                  {skills.map((skill) => (
                    <MenuItem
                      key={skill}
                      value={skill}
                      style={getStyles(skill, personName, theme)}
                    >
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Activity
              </Button>
            </Grid>
          </Grid>
        </Box>
        {loading ? (
          <>Loading</>
        ) : (
          Object.keys(activitys).map((id) => {
            return <Activity key={id} id={id} data={activitys[id]} />;
          })
        )}
      </Container>
    </>
  );
};

export default AddAcitivity;
