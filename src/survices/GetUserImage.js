import React, { useState } from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import logo from "../resourses/logo.png";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";

const GetUserImage = ({ email, isSet }) => {
  const [imageSrc, setImageSrc] = useState(logo);
  async function getLogo(email) {
    await getDownloadURL(ref(storage, `Users-Image/${email}/logo`))
      .then((url) => {
        setImageSrc(url);
      })
      .catch((error) => {
        console.log("Error: " + error.message);
      });
  }
  if (isSet) {
    getLogo(email);
  }
  return (
    <>
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
    </>
  );
};

export default GetUserImage;
