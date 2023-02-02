import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import {
  SetVolunterToAccept,
  RemoveVolunterFromRequest,
} from "../survices/VolunterEventState";
const Volunter = ({ dataa, showButton, setref, volunterid, eventid }) => {
  const [loading, setloading] = useState(true);
  const [data, setData] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  useEffect(() => {
    async function Unsubscribe() {
      const docRef = doc(db, "users", volunterid);
      const docSnap = await getDoc(docRef);
      setData(docSnap.data());
      setloading(false);
    }
    Unsubscribe();
  }, []);

  function HandleAdding() {
    setButtonLoading(true);
    SetVolunterToAccept(volunterid, eventid);
    RemoveVolunterFromRequest(volunterid, eventid);
  }
  return (
    <>
      {loading ? (
        <>loading...</>
      ) : (
        <Grid
          container
          borderBottom="1px solid black"
          borderTop="1px solid black"
          padding={1}
          marginY={1}
          alignContent="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <Typography variant="h6">{data.name}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Skills: {data.skills.join(", ")}
            </Typography>
          </Grid>
          <Grid item display={showButton ? "initial" : "none"}>
            <Button
              sx={{ textTransform: "none" }}
              onClick={HandleAdding}
              disabled={buttonLoading}
            >
              <Typography variant="body1">Add User</Typography>
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Volunter;
