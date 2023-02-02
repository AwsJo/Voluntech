import React, { useState } from "react";
import { Link as routerLink } from "react-router-dom";
import { Container, Grid, Button, Typography } from "@mui/material";

import {
  SetVolunterToRequest,
  RemoveVolunterFromRequest,
} from "../survices/VolunterEventState";
const Event = ({ id, data, UserUID }) => {
  const [requestStateChanged, setRequestStateChanged] = useState(
    data.voluntersRequest.indexOf(UserUID) == -1
  );
  const [requestStateLoading, setRequestStateLoading] = useState(false);
  return (
    <Container maxWidth="xs">
      <Grid
        container
        alignContent="center"
        key={id}
        rowSpacing={2}
        marginY={3}
        border="1px solid black"
        padding={2}
        borderRadius={1}
        textAlign="center"
      >
        <Grid item xs={12}>
          <Typography variant="h3">{data.name}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            component={routerLink}
            fullWidth
            sx={{ textTransform: "none" }}
            to={`/user/${data.creatorId}`}
          >
            <Typography variant="h4">By: {data.creatorName}</Typography>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography>{data.skills.join(", ")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{data.describtion}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Start at: {data.startingDate}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>End at: {data.endingDate}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Volunters:{" "}
            {`${data.acceptedVolunters.length}/${data.volunterNumber}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {requestStateChanged ? (
            <Button
              variant="outlined"
              sx={{ textTransform: "none" }}
              disabled={requestStateLoading}
              onClick={async () => {
                setRequestStateLoading(true);
                await SetVolunterToRequest(UserUID, id);
                setRequestStateChanged((current) => !current);
                setRequestStateLoading(false);
              }}
            >
              <Typography>Request to join</Typography>
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{ textTransform: "none" }}
                disabled={requestStateLoading}
                onClick={async () => {
                  setRequestStateLoading(true);
                  await RemoveVolunterFromRequest(UserUID, id);
                  setRequestStateChanged((current) => !current);
                  setRequestStateLoading(false);
                }}
              >
                <Typography>Cancel request</Typography>
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Event;
