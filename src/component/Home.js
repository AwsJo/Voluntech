import React from "react";
import Navbar from "./Navbar";
import { Typography, Container } from "@mui/material";

const Home = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ textAlign: "center", marginY: 4 }}>
        <Typography variant="h2" marginBottom={2}>
          Voluntech
        </Typography>
        <Typography variant="h4">
          Voluntech is a volunteering platform allows fresh graduates and career
          changers to kick off their careers and increase their confidence in
          their skills by volunteering in tech activities and helping Non-Profit
          companies and influence the local community.
        </Typography>
      </Container>
    </>
  );
};

export default Home;
