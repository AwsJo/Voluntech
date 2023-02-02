import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import Event from "./Event";
import Navbar from "./Navbar";
import { Grid, TextField } from "@mui/material";
import {
  Container,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import usePagination from "../survices/Pagination";
import { findCommonElement } from "../survices/commonOnArrays";
import { skills } from "./Singup";
import { useTheme } from "@mui/system";
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
function getStyles(name, skillName, theme) {
  return {
    fontWeight:
      skillName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Events = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState({});
  const [eventsFilter, SetEventsFilter] = useState({});
  const [skillName, setSkillName] = useState([]);
  //pagination
  let [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const count = Math.ceil(Object.keys(eventsFilter).length / PER_PAGE);
  const _DATA = usePagination(Object.keys(eventsFilter), PER_PAGE);
  const handlePageChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  async function getVolunters() {
    const q = query(collection(db, "activity"), where("open", "==", true));
    const querySnapshot = await getDocs(q);
    let eventss = {};

    querySnapshot.forEach((doc) => {
      eventss[doc.id.toString()] = doc.data();
    });
    setEvents(eventss);
    SetEventsFilter(eventss);
    setLoading(false);
  }
  useEffect(() => {
    const unscribe = () => {
      getVolunters();
    };
    return unscribe();
  }, []);
  //Filter Function
  function filter() {
    let filteredObject = { ...events };
    //Filter By name
    if (document.getElementById("name").value) {
      const keys = Object.keys(filteredObject);
      let filteredArray = keys.filter((key) => {
        return events[key]["creatorName"]
          .toLowerCase()
          .includes(document.getElementById("name").value.toLowerCase());
      });
      let filteredVolunters = {};
      filteredArray.forEach((e) => {
        filteredVolunters[e] = events[e];
      });
      filteredObject = { ...filteredVolunters };
    }
    //filter by skills
    if (document.getElementById("multiple-skill").value != undefined) {
      if (document.getElementById("multiple-skill").value.length > 0) {
        const keys = Object.keys(filteredObject);
        let filteredArray = keys.filter((key) => {
          return findCommonElement(
            events[key]["skills"],
            document.getElementById("multiple-skill").value
          );
        });
        let filteredVolunters = {};
        filteredArray.forEach((e) => {
          filteredVolunters[e] = events[e];
        });
        filteredObject = { ...filteredVolunters };
      }
    }

    SetEventsFilter({ ...filteredObject });
  }
  // Name Change Handler
  function HandleNameChange(e) {
    SetEventsFilter({ ...events });
    filter();
  }
  // Skill Change Handler
  const handleSkillChange = (event) => {
    SetEventsFilter({ ...events });
    document.getElementById("multiple-skill").value = event.target.value;
    const {
      target: { value },
    } = event;
    setSkillName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    filter();
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg">
        <Grid
          container
          alignContent="center"
          rowSpacing={2}
          marginY={3}
          textAlign="center"
        >
          {/* Select Skills Filtering */}
          <Grid item xs={12}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <InputLabel id="multiple-skill-label">skill</InputLabel>
              <Select
                labelId="multiple-skill-label"
                id="multiple-skill"
                multiple
                value={skillName}
                onChange={handleSkillChange}
                input={<OutlinedInput label="Skills" />}
                MenuProps={MenuProps}
              >
                {skills.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* fitler by Company Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              id="name"
              variant="outlined"
              onChange={HandleNameChange}
            />
          </Grid>
        </Grid>
        <div
          style={{
            display: "grid",
            position: "relative",
            gridTemplateColumns: "repeat(auto-fill, clamp(250px, 350px, 1fr))",
            gap: "10px",

            maxWidth: "100%",
          }}
        >
          {loading ? (
            <h1>Loading</h1>
          ) : (
            <>
              {_DATA.currentData().map((key) => (
                <Event
                  id={key}
                  data={events[key]}
                  key={key}
                  UserUID={currentUser.uid}
                />
              ))}
              <Grid item xs={12}>
                <Pagination
                  count={count}
                  size="large"
                  page={page}
                  variant="outlined"
                  shape="rounded"
                  onChange={handlePageChange}
                  sx={{
                    mt: 3,
                    mb: 3,
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </Grid>{" "}
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Events;
