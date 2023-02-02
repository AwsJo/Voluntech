import { Grid, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Volunter from "./Volunter";
const Activity = ({ id, data }) => {
  console.log(id, data);
  const [ref, setref] = useState(true);
  useEffect(() => {}, [ref]);
  return (
    <Grid
      container
      sx={{
        border: "1px solid black",
        borderRadius: 1,
        marginY: 3,
        p: 3,
        mx: "auto",
        justifyContent: "center",
        alignItems: "center",
        direction: "column",
      }}
    >
      <Grid item xs={12} borderBottom="1px solid black">
        <Typography variant="h4">{data.name}</Typography>
      </Grid>
      <Grid item xs={12} borderBottom="1px solid black">
        <Typography variant="h5">
          from {data.startingDate} to {data.endingDate}
        </Typography>
      </Grid>
      <Grid item container xs={12} marginTop={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Accepted Volunters</Typography>
        </Grid>
        {data.acceptedVolunters.map((volunter) => {
          return (
            <Grid key={volunter}>
              <Volunter
                volunterid={volunter}
                setref={setref}
                eventid={id}
                showButton={false}
              ></Volunter>
            </Grid>
          );
        })}
      </Grid>
      <Grid item container xs={12} marginTop={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Volunters Request</Typography>
        </Grid>
        {data.voluntersRequest.map((volunter) => {
          return (
            <Grid key={volunter}>
              <Volunter
                dataa={data}
                volunterid={volunter}
                setref={setref}
                eventid={id}
                showButton={true}
              ></Volunter>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default Activity;
