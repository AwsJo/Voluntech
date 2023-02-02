import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import GetUserImage from "../survices/GetUserImage";
import Navbar from "./Navbar";
import Container from "@mui/material/Container";
const UserPage = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState("");
  const [foundUser, setFoundUser] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function UserInfoByUID() {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(JSON.stringify(docSnap.data()));
        setFoundUser(true);
        setLoading(false);
      } else {
        setUserInfo("User Was Not Found");
        setFoundUser(false);
        setLoading(false);
      }
    }
    UserInfoByUID();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="xs">
        <Grid container rowSpacing={3} key={userId} sx={{ marginY: 4 }}>
          {loading ? (
            <h1>Loading Please Wait...</h1>
          ) : (
            <>
              {foundUser ? (
                <>
                  <Grid
                    item
                    container
                    sx={{
                      p: 3,
                      maxWidth: "80%",
                      mx: "auto",
                      justifyContent: "center",
                      alignItems: "center",
                      direction: "column",
                    }}
                  >
                    <GetUserImage
                      email={JSON.parse(userInfo).email}
                      isSet={JSON.parse(userInfo).imageIsSet}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h3" width={"100%"} align="center">
                      {JSON.parse(userInfo).name}
                    </Typography>
                  </Grid>
                  {!JSON.parse(userInfo).organizationType || (
                    <Grid item xs={12}>
                      <Typography variant="h4" width={"100%"} align="center">
                        Organization Type:{" "}
                        {JSON.parse(userInfo).organizationType}
                      </Typography>
                    </Grid>
                  )}
                  {!JSON.parse(userInfo).skills || (
                    <Grid item xs={12}>
                      <Typography variant="h4" width={"100%"} align="center">
                        Skills : {JSON.parse(userInfo).skills.join(", ")}
                      </Typography>
                    </Grid>
                  )}
                  {!JSON.parse(userInfo).avalible || (
                    <Grid item xs={12}>
                      <Typography variant="h4" width={"100%"} align="center">
                        {JSON.parse(userInfo).avalible}
                      </Typography>
                    </Grid>
                  )}

                  {/* <h3>email: {JSON.parse(userInfo).email}</h3>
                  <h3>Phone: {JSON.parse(userInfo).phone}</h3> */}
                  <Grid item xs={12}>
                    <Button
                      sx={{ width: "100%", textTransform: "none" }}
                      onClick={() => {
                        window.location.href = `tel:${
                          JSON.parse(userInfo).phone
                        }`;
                      }}
                      variant="contained"
                    >
                      <Typography>
                        Call: {JSON.parse(userInfo).phone}
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      sx={{
                        width: "100%",
                        textTransform: "none",
                      }}
                      onClick={() => {
                        window.location.href = `mailto:${
                          JSON.parse(userInfo).email
                        }`;
                      }}
                      variant="contained"
                    >
                      <Typography>
                        Mail: {JSON.parse(userInfo).email}
                      </Typography>
                    </Button>
                  </Grid>
                  {!JSON.parse(userInfo).website || (
                    <Grid item xs={12}>
                      <Typography variant="h5" width={"100%"} align="center">
                        Website: {JSON.parse(userInfo).website}
                      </Typography>
                    </Grid>
                  )}
                  {!JSON.parse(userInfo).experience || (
                    <Grid item xs={12}>
                      <Typography variant="h5" width={"100%"} align="center">
                        Experience: {JSON.parse(userInfo).experience}
                      </Typography>
                    </Grid>
                  )}
                  {!JSON.parse(userInfo).courses || (
                    <Grid item xs={12}>
                      <Typography variant="h5" width={"100%"} align="center">
                        Courses: {JSON.parse(userInfo).courses}
                      </Typography>
                    </Grid>
                  )}
                  {!JSON.parse(userInfo).city || (
                    <Grid item xs={12}>
                      <Typography variant="h5" width={"100%"} align="center">
                        City: {JSON.parse(userInfo).city}
                      </Typography>
                    </Grid>
                  )}
                </>
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h2">{userInfo}</Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default UserPage;
