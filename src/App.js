import React from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./component/Home";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import UserProtectedRoutes from "./context/UserProtectedRoutes";
import VisitorProtectedRoutes from "./context/VisitorProtectedRoutes";
import UserPage from "./component/UserPage";
import OrganizationProtectedRoutes from "./context/OrganizationProtectedRoutes";
import AddAcitivity from "./component/AddAcitivity";
import Activitys from "./component/Activitys";
import Users from "./component/Users";
import VolunterProtectedRoutes from "./context/VolunterProtectedRoutes";
import PageNotFound from "./component/PageNotFound";
import Events from "./component/Events";
const Home = lazy(() => import("./component/Home"));
const Signin = lazy(() => import("./component/Signin"));
const Signup = lazy(() => import("./component/Singup"));
const Profile = lazy(() => import("./component/Profile"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<h1>Loading...</h1>}>
          <CssBaseline />
          <div className="App">
            <></>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route element={<VisitorProtectedRoutes />}>
                <Route exact path="/signin" element={<Signin />} />
                <Route exact path="/signup" element={<Signup />} />
              </Route>
              <Route element={<UserProtectedRoutes />}>
                <Route path="/user">
                  <Route path=":userId" element={<UserPage />} />
                </Route>
                <Route path="/profile" element={<Profile />} />
                <Route element={<OrganizationProtectedRoutes />}>
                  <Route path="/addevent" element={<AddAcitivity />} />
                  <Route path="/users" element={<Users />} />
                </Route>
                <Route element={<VolunterProtectedRoutes />}>
                  <Route path="/events" element={<Events />} />
                </Route>
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
