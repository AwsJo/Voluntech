import React from "react";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import GetUserImage from "../survices/GetUserImage";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Grid,
  Typography,
} from "@mui/material";
import { citys, skills } from "./Singup";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { findCommonElement } from "../survices/commonOnArrays";
import Pagination from "@mui/material/Pagination";
import usePagination from "../survices/Pagination";
import { Button } from "@mui/material";
import { Link as routerLink } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
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
const Users = () => {
  const theme = useTheme();
  const [skillName, setSkillName] = useState([]);
  const [volunters, setVolunters] = useState({});
  const [voluntersFilter, setVoluntersFilter] = useState({});
  const [loading, setloading] = useState(true);
  const [filterCity, setFilterCity] = useState("");

  //pagination
  let [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const count = Math.ceil(Object.keys(voluntersFilter).length / PER_PAGE);
  const _DATA = usePagination(Object.keys(voluntersFilter), PER_PAGE);
  const handlePageChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  async function getVolunters() {
    const q = query(collection(db, "users"), where("type", "==", "volunter"));

    const querySnapshot = await getDocs(q);
    let users = {};

    querySnapshot.forEach((doc) => {
      users[doc.id.toString()] = doc.data();
    });
    setVolunters(users);
    setVoluntersFilter(users);
    setloading(false);
  }
  useEffect(() => {
    const unscribe = () => {
      getVolunters();
    };
    return unscribe();
  }, []);

  // function fillter
  function filter() {
    let filteredObject = { ...volunters };
    //filter by skills
    if (document.getElementById("multiple-skill").value != undefined) {
      if (document.getElementById("multiple-skill").value.length > 0) {
        const keys = Object.keys(filteredObject);
        let filteredArray = keys.filter((key) => {
          return findCommonElement(
            volunters[key]["skills"],
            document.getElementById("multiple-skill").value
          );
        });
        let filteredVolunters = {};
        filteredArray.forEach((e) => {
          filteredVolunters[e] = volunters[e];
        });
        filteredObject = { ...filteredVolunters };
      }
    }
    // filter by city
    if (
      document.getElementById("city-select").value != "" &&
      document.getElementById("city-select").value != undefined
    ) {
      const keys = Object.keys(filteredObject);
      const filtered = keys.filter((key) => {
        return (
          volunters[key]["city"] ===
          document.getElementById("city-select").value
        );
      });
      let filteredVolunters = {};
      filtered.forEach((e) => {
        filteredVolunters[e] = volunters[e];
      });
      filteredObject = { ...filteredVolunters };
    }
    setVoluntersFilter({ ...filteredObject });
  }

  // City change handler
  const cityChangeHandler = (e) => {
    document.getElementById("city-select").value = e.target.value;
    setFilterCity(e.target.value);
    setVoluntersFilter({ ...volunters });

    filter();
  };
  // Skill Change Handler
  const handleSkillChange = (event) => {
    setVoluntersFilter({ ...volunters });
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
      <Container component="main" maxWidth="lg">
        {loading ? (
          <>
            <h1>Loading...</h1>
          </>
        ) : (
          <>
            <Grid container rowSpacing={2} sx={{ marginX: "auto" }}>
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
                      <MenuItem
                        key={skill}
                        value={skill}
                        style={getStyles(skill, skillName, theme)}
                      >
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="city-select-label">City</InputLabel>
                  <Select
                    labelId="city-select-label"
                    id="city-select"
                    value={filterCity}
                    label="City"
                    onChange={cityChangeHandler}
                  >
                    {citys.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <div
                style={{
                  display: "grid",
                  position: "relative",
                  gridTemplateColumns: "repeat(auto-fill,minmax(250px, 1fr))",
                  gap: "10px",

                  maxWidth: "100%",
                }}
              >
                {_DATA.currentData().map((uid) => {
                  return (
                    <Grid
                      item
                      key={uid}
                      container
                      sx={{
                        border: "1px solid black",
                        borderRadius: 1,
                        mt: 4,
                        p: 3,
                        mx: "auto",
                        justifyContent: "center",
                        alignItems: "center",
                        direction: "column",
                      }}
                    >
                      <GetUserImage
                        email={volunters[uid].email}
                        isSet={volunters[uid].imageIsSet}
                      />
                      <Typography
                        variant="h4"
                        mt={2}
                        display="inline"
                        width={"100%"}
                        align="center"
                      >
                        {volunters[uid].name}
                      </Typography>
                      <Typography
                        variant="h5"
                        marginY={2}
                        display="inline"
                        width={"100%"}
                        align="center"
                      >
                        {volunters[uid].avalible}
                      </Typography>

                      <Button
                        variant="outlined"
                        component={routerLink}
                        fullWidth
                        to={`/user/${uid}`}
                      >
                        profile
                      </Button>
                    </Grid>
                  );
                })}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Pagination
                count={count}
                size="large"
                page={page}
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
                sx={{ mt: 3, mb: 3, display: "flex", justifyContent: "center" }}
              />
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default Users;
